using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.Order;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly ICartRepository _cartRepo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPaymentService _paymentService;

        public OrderService(ICartRepository cartRepo, IUnitOfWork unitOfWork, IPaymentService paymentService)
        {
            _paymentService = paymentService;
            _unitOfWork = unitOfWork;
            _cartRepo = cartRepo;
        }

        public async Task<Order> CreateOrder(string buyerEmail, int deliveryMethodId, string cartId, Address shippingAddress)
        {
            // get cart from repo
            var cart = await _cartRepo.GetCartAsync(cartId);

            // list for orderItems
            var items = new List<OrderItem>();

            // for each item in the cart
            foreach (var item in cart.Items)
            {
                // get item from repo
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                // snapshot of order is when it's been placed
                var itemOrdered = new ProductItemOrder(productItem.Id, productItem.Name, productItem.PictureUrl);
                // create the orderItem
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);

                // save order items to items list
                items.Add(orderItem);
            }

            // get delivery method from repo by id
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);

            // calc the subtotal item price * quantity
            var subtotal = items.Sum(item => item.Price * item.Quantity);

            // check if payment intent exists
            var spec = new OrderByPaymentIntentIdSpecification(cart.PaymentIntentId);
            var existingOrder = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            // if order exists, delete order and make a new one
            if (existingOrder != null)
            {
                _unitOfWork.Repository<Order>().Delete(existingOrder);
                // update payment intent as precaution to ensure accuracy
                await _paymentService.CreateOrUpdatePaymentIntent(cart.PaymentIntentId);
            }

            // create the order
            var order = new Order(items, buyerEmail, shippingAddress, deliveryMethod, subtotal, cart.PaymentIntentId);

            // instantiate our order repository.
            _unitOfWork.Repository<Order>().Add(order);

            // save changes to db
            var result = await _unitOfWork.Complete();

            if (result <= 0)
            {
                return null;
            }

            // return the order
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethods()
        {
            // return list of delivery methods
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderById(int id, string buyerEmail)
        {
            // specification to get order by the id and user's email
            var spec = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);

            // return order
            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUser(string buyerEmail)
        {
            // specification to return all orders with user email
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);

            // return order list
            return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }
    }
}