using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.Order;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IOrderService _orderService;
        public OrdersController(IOrderService orderService, IMapper mapper)
        {
            _orderService = orderService;
            _mapper = mapper;

        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
        {
            var email = HttpContext.User.RetrieveEmailFromPrincipal();
            var address = _mapper.Map<AddressToReturnDto, Address>(orderDto.ShipToAddress);
            var order = await _orderService.CreateOrder(email, orderDto.DeliveryMethodId, orderDto.CartId, address);

            if (order == null) {
                return BadRequest(new ApiResponse(400, "There was a problem creating the ordre"));
            }

            return Ok(order);
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetOrdersForUser() 
        {
            var email = HttpContext.User.RetrieveEmailFromPrincipal();
            var orders = await _orderService.GetOrdersForUser(email);

            return Ok(_mapper.Map<IReadOnlyList<Order>, IReadOnlyList<OrderToReturnDto>>(orders));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrderById(int id) 
        {
            var email = HttpContext.User.RetrieveEmailFromPrincipal();
            var order = await _orderService.GetOrderById(id, email);

            if (order == null) {
                return NotFound(new ApiResponse(404));
            }

            return _mapper.Map<Order, OrderToReturnDto>(order);
        }

        [HttpGet("deliveryMethods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods() 
        {
            return Ok(await _orderService.GetDeliveryMethods());
        }
    }
} 
