using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace API.Extensions
{
    public static class SwaggerServiceExtensions
    {
        public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
        {
            services.AddSwaggerGen(x => 
            {   
                x.SwaggerDoc("v1", new OpenApiInfo {Title = "Legion API", Version = "v1"});

                var securitySchema = new OpenApiSecurityScheme
                {
                    Description = "JWT Auth Bearer Scheme",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                };

                x.AddSecurityDefinition("Bearer", securitySchema);
                var securityRequirement = new OpenApiSecurityRequirement {{securitySchema, new[]{"Bearer"}}};

                x.AddSecurityRequirement(securityRequirement);
            
            });

            return services;
        }

        public static IApplicationBuilder UseSwaggerDocumentation(this IApplicationBuilder app)
        {
            // Swagger middleware will allow us to browse to a web page which is going to show all of the API endpoints
            app.UseSwagger();

            app.UseSwaggerUI(x => 
            {
                x.SwaggerEndpoint("/swagger/v1/swagger.json", "Legion API v1");
            });

            return app;
        }
    }
}