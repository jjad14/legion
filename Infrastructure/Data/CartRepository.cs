using System;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using StackExchange.Redis;

namespace Infrastructure.Data
{
    public class CartRepository : ICartRepository
    {
        private readonly IDatabase _database;
        public CartRepository(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();
        }
        public async Task<bool> DeleteCartAsync(string cartId)
        {
           return await _database.KeyDeleteAsync(cartId); 
        }

        public async Task<CustomerCart> GetCartAsync(string cartId)
        {
            var data = await _database.StringGetAsync(cartId);

            return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<CustomerCart>(data);
        }

        public async Task<CustomerCart> UpdateCreateCartAsync(CustomerCart cart)
        {
            var created = await _database
                .StringSetAsync(cart.Id, JsonSerializer.Serialize(cart), TimeSpan.FromDays(30));

            if (!created) return null;

            return await GetCartAsync(cart.Id);
        }
    }
}