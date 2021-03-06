using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMapper _mapper;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager,
        ITokenService tokenService, IMapper mapper)
        {
            _mapper = mapper;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserToReturnDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailFromClaimsPrincipal(HttpContext.User);

            return new UserToReturnDto
            {
                DisplayName = user.DisplayName,
                Email = user.Email,
                Token = await _tokenService.CreateToken(user)
            };
        }

        [HttpGet("emailverify")]
        public async Task<ActionResult<bool>> CheckEmailExists([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email.ToLower()) != null;
        }

        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<AddressToReturnDto>> GetUserAddress()
        {
            var user = await _userManager.FindByClaimsPrincipalWithAddress(HttpContext.User);

            return _mapper.Map<Address, AddressToReturnDto>(user.Address);
        }

        [Authorize]
        [HttpPut("address/edit")]
        public async Task<ActionResult<AddressToReturnDto>> UpdateUserAddress(AddressToReturnDto address)
        {
            var user = await _userManager.FindByClaimsPrincipalWithAddress(HttpContext.User);

            user.Address = _mapper.Map<AddressToReturnDto, Address>(address);

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded) {
                return Ok(_mapper.Map<Address, AddressToReturnDto>(user.Address));
            }

            return BadRequest("Could not update the user.");
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserToReturnDto>> Login(UserLoginDto userLoginDto)
        {
            var user = await _userManager.FindByEmailAsync(userLoginDto.Email.ToLower());

            if (user == null)
            {
                return Unauthorized(new ApiResponse(401));
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, userLoginDto.Password, false);

            if (!result.Succeeded)
            {
                return Unauthorized(new ApiResponse(401));
            }

            return new UserToReturnDto
            {
                DisplayName = user.DisplayName,
                Email = user.Email,
                Token = await _tokenService.CreateToken(user)
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserToReturnDto>> Register(UserRegisterDto userRegisterDto)
        {
            if (CheckEmailExists(userRegisterDto.Email).Result.Value) {
                return new BadRequestObjectResult(new ApiValidationErrorResponse{
                    Errors = new []{"Email Address already exists."}
                    });
            }

            var user = new User
            {
                DisplayName = userRegisterDto.DisplayName,
                Email = userRegisterDto.Email.ToLower(),
                UserName = userRegisterDto.Email.ToLower()
            };

            var result = await _userManager.CreateAsync(user, userRegisterDto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new ApiResponse(400));
            }

            var roleResult = await _userManager.AddToRoleAsync(user, "Customer");

            if (!roleResult.Succeeded) 
            {
                return BadRequest(new ApiResponse(400));
            }

            return new UserToReturnDto
            {
                DisplayName = user.DisplayName,
                Email = user.Email,
                Token = await _tokenService.CreateToken(user)
            };
        }
    }
}

