using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.Order;

namespace Core.Interfaces
{
    public interface IPaymentService
    {
        Task<CustomerCart> CreateOrUpdatePaymentIntent(string cartId);
        Task<Order> UpdateOrderPaymentSucceeded(string paymentIntentId);
        Task<Order> UpdateOrderPaymentFailed(string paymentIntentId);

    }
}