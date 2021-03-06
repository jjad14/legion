using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface ICartRepository
    {
        Task<CustomerCart> GetCartAsync(string cartId);
        Task<CustomerCart> UpdateCreateCartAsync(CustomerCart cart);
        Task<bool> DeleteCartAsync(string cartId);
    }
}