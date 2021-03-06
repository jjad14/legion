using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities.Order;

namespace Core.Interfaces
{
    public interface IOrderService
    {
        Task<Order> CreateOrder(string buyerEmail, int deliveryMethod, string cartId, Address shippingAddress);
        Task<IReadOnlyList<Order>> GetOrdersForUser(string buyerEmail);
        Task<Order> GetOrderById(int id, string buyerEmail);
        Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethods();
    }
}