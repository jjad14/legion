using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace API.Helpers
{
    public class CachedAttribute : Attribute, IAsyncActionFilter
    {
        private readonly int _timeToLiveSecs;
        public CachedAttribute(int timeToLiveSecs)
        {
            _timeToLiveSecs = timeToLiveSecs;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var cacheService = context.HttpContext.RequestServices.GetRequiredService<IResponseCacheService>();

            // generate a key that we're going to be able to identify in our redis database
            // what it is that's being asked for so that we can check to see if we have it so that we can then return it
            var cacheKey = GenerateCacheKeyFromRequest(context.HttpContext.Request);
            var cachedResponse = await cacheService.GetCachedResponseAsync(cacheKey);

            // not empty means we have something in cache to return
            if (!string.IsNullOrEmpty(cachedResponse)) {
                var contentResult = new ContentResult
                {
                    Content = cachedResponse,
                    ContentType = "application/json",
                    StatusCode = 200
                };

                context.Result = contentResult;

                return;
            }

            // move to controller
            var executedContext = await next();

            //  put the results into the cache
            if (executedContext.Result is OkObjectResult okObjectResult) {
                await cacheService.CacheResponseAsync(cacheKey, okObjectResult.Value, TimeSpan.FromSeconds(_timeToLiveSecs));
            }
        }

        private string GenerateCacheKeyFromRequest(HttpRequest request)
        {
            var keyBuilder = new StringBuilder();

            // Appends a copy of the request path to this instance
            keyBuilder.Append($"{request.Path}");

            //  loop over all of the query strings, all the keys and the values in the query string
            foreach (var (key, value) in request.Query.OrderBy(x => x.Key))
            {
                // append key-value into keybuilder instance
                keyBuilder.Append($"|{key}-{value}");
            }

            return keyBuilder.ToString();
        }
    }
}