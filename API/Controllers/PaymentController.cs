using System.IO;
using System.Threading.Tasks;
using API.Errors;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Stripe;
using Order = Core.Entities.Order.Order;

namespace API.Controllers
{
    public class PaymentController : BaseApiController
    {
        private readonly IPaymentService _paymentService;
        // web hook secret
        private readonly string _whSecret;
        private readonly ILogger<IPaymentService> _logger;

        public PaymentController(IPaymentService paymentService, ILogger<IPaymentService> logger, IConfiguration config)
        {
            _logger = logger;
            _paymentService = paymentService;
            _whSecret = config.GetSection("StripeSettings:WhSecret").Value;
        }

        [Authorize]
        [HttpPost("{cartId}")]
        public async Task<ActionResult<CustomerCart>> CreateOrUpdatePaymentIntent(string cartId)
        {
            var cart = await _paymentService.CreateOrUpdatePaymentIntent(cartId);

            if (cart == null)
            {
                return BadRequest(new ApiResponse(400, "Problem with your cart"));
            }

            return cart;
        }

        // web hook to stripe
        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebHook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            // we pass our whsecret to stripe to confirm that this is definitely from stripe and we can trust this stripe event
            // this is the part where we're confirming the payment from the client and our Web hook needs to be available anonymously
            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], _whSecret);

            PaymentIntent intent;
            Order order;

            switch (stripeEvent.Type)
            {
                case "payment_intent.succeeded":
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    _logger.LogInformation("Payment Succedeed: ", intent.Id);
                    order = await _paymentService.UpdateOrderPaymentSucceeded(intent.Id);
                    _logger.LogInformation("Order updated and payment recieved: ", order.Id);
                    break;
                case "payment_intent.payment_failed":
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    _logger.LogInformation("Payment Failed: ", intent.Id);
                    order = await _paymentService.UpdateOrderPaymentFailed(intent.Id);
                    _logger.LogInformation("Payment failed: ", order.Id);
                    break;
            }
            // we send this back to stripe and it confirms that we've received our events
            // now in production in live mode on stripe, If their event doesn't get a response 
            // back from us then they're going to keep trying to send us the event for up to three days 
            // slightly less in test mode, I think it's only for a couple of hours 
            // So this just goes back to stripe and confirms that so they don't keep trying to send us the events
            return new EmptyResult();
        }
    }
}