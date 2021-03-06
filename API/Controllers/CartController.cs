using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CartController : BaseApiController
    {
        private readonly ICartRepository _repo;
        private readonly IMapper _mapper;
        public CartController(ICartRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<ActionResult<CustomerCart>> GetCartById(string id)
        {
            var cart = await _repo.GetCartAsync(id);

            return Ok(cart ?? new CustomerCart(id));
        }

        [HttpPost]
        public async Task<ActionResult<CustomerCart>> UpdateCart(CustomerCartDto cart)
        {
            var customerCart = _mapper.Map<CustomerCartDto, CustomerCart>(cart);

            var updatedCart = await _repo.UpdateCreateCartAsync(customerCart);

            return Ok(updatedCart);
        }

        [HttpDelete]
        public async Task DeleteCart(string id)
        {
            await _repo.DeleteCartAsync(id);
        }
    }
}