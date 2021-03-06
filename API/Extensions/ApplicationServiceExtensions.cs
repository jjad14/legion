using System.Linq;
using API.Errors;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{
    // Extends the IServiceCollection,  adds the services to this and then we're returning these services
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddSingleton<IResponseCacheService, ResponseCacheService>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<ICartRepository, CartRepository>();
            services.AddScoped(typeof(IGenericRepository<>), (typeof(GenericRepository<>)));

            // add after AddControllers()
            // configure by overriding the apicontroller attribute behavior
            services.Configure<ApiBehaviorOptions>(options => 
            {
                // 
                options.InvalidModelStateResponseFactory = actionContext =>
                {
                    // go inside this model state and extract the errors if there are any
                    // and populate the error messages into an array which will be passed into our API validation error response
                    var errors = actionContext.ModelState
                        .Where(e => e.Value.Errors.Count > 0)
                        .SelectMany(x => x.Value.Errors)
                        .Select(x => x.ErrorMessage)
                        .ToArray();

                    // Initialize ApiValidationErrorResponse with errors array
                    var errorResponse = new ApiValidationErrorResponse
                    {
                        Errors = errors
                    };

                    // return a new BadRequestObjectResult instance with the error response
                    return new BadRequestObjectResult(errorResponse);
                };
            });

            return services;
        }
    }
}