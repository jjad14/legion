using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.Order;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.Extensions.Configuration;
using Stripe;
using Order = Core.Entities.Order.Order;
using Product = Core.Entities.Product;

namespace Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IConfiguration _config;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICartRepository _cartRepository;
        
        public PaymentService(ICartRepository cartRepository, IUnitOfWork unitOfWork, IConfiguration config)
        {
            _cartRepository = cartRepository;
            _unitOfWork = unitOfWork;
            _config = config;
        }

        public async Task<CustomerCart> CreateOrUpdatePaymentIntent(string cartId)
        {
            // set stripe api key to config stripe api key
            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

            // get card by id
            var cart = await _cartRepository.GetCartAsync(cartId);
            // 0m for money in decimal format
            var shippingPrice = 0m;

            // cart does not exist
            if (cart == null) {
                return null;
            }

            // get delivery method
            // update shipping price
            if (cart.DeliveryMethodId.HasValue) {
                var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync((int)cart.DeliveryMethodId);
                shippingPrice = deliveryMethod.Price;
            }

            // check if item price matches prices stored in db
            foreach (var item in cart.Items)
            {
                // get price of each item in cart
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);

                // check if prices match, if they dont change cart item price to db item price
                if (item.Price != productItem.Price) {
                    item.Price = productItem.Price;
                }
            }

            var service = new PaymentIntentService();

            PaymentIntent intent;

            // check if we are updating payment intent or creating a new payment intent
            if (string.IsNullOrEmpty(cart.PaymentIntentId)) {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long) cart.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long) shippingPrice * 100,
                    Currency = "cad",
                    PaymentMethodTypes = new List<string>{"card"}
                };
                // creates payment intent
                intent = await service.CreateAsync(options);
                // use values from intent to update the cart
                cart.PaymentIntentId = intent.Id;
                cart.ClientSecret = intent.ClientSecret;
            }
            else {
                // updating a payment intent amount
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = (long) cart.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long) shippingPrice * 100,
                };

                // update the payment intent
                await service.UpdateAsync(cart.PaymentIntentId, options);
            }

            // update current state of the cart
            // which is gonna be updated with the correct prices if they were changed
            // and also the payment intent and client secret if it's a new payment in we've created.
            await _cartRepository.UpdateCreateCartAsync(cart);

            return cart;
        }

        public async Task<Order> UpdateOrderPaymentFailed(string paymentIntentId)
        {
            // get order
            var spec = new OrderByPaymentIntentIdSpecification(paymentIntentId);
            var order = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            if (order == null) {
                return null;
            }

            // set order status to paymentfailed
            order.Status = OrderStatus.PaymentFailed;

            await _unitOfWork.Complete();

            // return order
            return order;
        }

        public async Task<Order> UpdateOrderPaymentSucceeded(string paymentIntentId)
        {
            // get order
            var spec = new OrderByPaymentIntentIdSpecification(paymentIntentId);
            var order = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            if (order == null) {
                return null;
            }

            // set order status to payment recieved
            order.Status = OrderStatus.PaymentReceived;
            _unitOfWork.Repository<Order>().Update(order);

            await _unitOfWork.Complete();

            // return order
            return order;
        }
    }
}