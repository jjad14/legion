using System;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly AppIdentityDbContext _context;

        public AdminController(UserManager<User> userManager, IGenericRepository<Product> productsRepo,
        IUnitOfWork unitOfWork, IMapper mapper, AppIdentityDbContext context)
        {
            _context = context;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _productsRepo = productsRepo;
            _userManager = userManager;
        }

        // [Authorize(Policy = "RequireCustomerRole")]
        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await _context.Users
                .Include(r => r.UserRoles)
                .ThenInclude(r => r.Role)
                .OrderBy(u => u.DisplayName)
                .Select(u => new
                {
                    Id = u.Id,
                    DisplayName = u.UserName,
                    Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                })
                .ToListAsync();

            return Ok(users);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("edit-roles/{email}")]
        public async Task<ActionResult> EditRoles(string email, [FromQuery] string roles)
        {
            var selectedRoles = roles.Split(",").ToArray();
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                NotFound("User not found");
            }

            var userRoles = await _userManager.GetRolesAsync(user);

            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded)
            {
                return BadRequest(new ApiResponse(400, "Failed to add roles"));
            }

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded)
            {
                return BadRequest(new ApiResponse(400, "Failed to remove roles"));
            }

            return Ok(await _userManager.GetRolesAsync(user));
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpDelete("user/{email}")]
        public async Task<ActionResult> DeleteUser(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                NotFound("User not found");
            }

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(new ApiResponse(400, "Failed to delete user"));
            }

            return Ok();
        }

        [Authorize(Policy = "RequireEmployeeRole")]
        [HttpGet("products")]
        public async Task<ActionResult<bool>> GetProducts()
        {
            var prod = await _productsRepo.ListAllAsync();
            var products = _mapper.Map<ProductToReturnDto[]>(prod);

            return Ok(products);
        }


        [Authorize(Policy = "RequireEmployeeRole")]
        [HttpPost("create-product")]
        public async Task<ActionResult<ProductToReturnDto>> CreateProduct(ProductToCreateDto prod)
        {
            prod.PictureUrl = "images/products/default-product.png";
            
            var product = _mapper.Map<ProductToCreateDto, Product>(prod);

            _unitOfWork.Repository<Product>().Add(product);

            var result = await _unitOfWork.Complete();

            if (result <= 0)
            {
                return BadRequest(new ApiResponse(400, "Nope"));
            }

            var prodReturn = _mapper.Map<Product, ProductToReturnDto>(product);

            return Ok(prodReturn);
        }

        [Authorize(Policy = "RequireEmployeeRole")]
        [HttpPut("edit-product/{id}")]
        public async Task<ActionResult> UpdateProduct(int id, [FromBody] ProductToUpdateDto prod) 
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);
            var product = await _productsRepo.GetEntityWithSpec(spec);

            if (product == null)
            {
                return NotFound(new ApiResponse(404, "Product not found."));
            }

            product.Name = prod.Name;
            product.Description = prod.Description;
            product.Price = Convert.ToDecimal(prod.Price);
        
            _unitOfWork.Repository<Product>().Update(product);

            var result = await _unitOfWork.Complete();

            if (result <= 0)
            {
                return BadRequest();
            }

            return Ok();
        }

        [Authorize(Policy = "RequireEmployeeRole")]
        [HttpDelete("product/{id}")]
        public async Task<ActionResult<bool>> DeleteProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);
            var product = await _productsRepo.GetEntityWithSpec(spec);

            if (product == null)
            {
                return NotFound(new ApiResponse(404, "Product not found."));
            }

            _unitOfWork.Repository<Product>().Delete(product);

            var result = await _unitOfWork.Complete();

            if (result <= 0)
            {
                return BadRequest();
            }

            return Ok(true);
        }
    }
}
