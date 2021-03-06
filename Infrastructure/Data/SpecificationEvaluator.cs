using System.Linq;
using Core.Entities;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class SpecificationEvaluator<TEntity> where TEntity : BaseEntity
    {
        public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQuery, 
        ISpecification<TEntity> spec)
        {
            // because it's a DbSet we can now use the data context methods to go and actually apply the queries into our expression
            var query = inputQuery;

            if (spec.Criteria != null)
            {
                // apply the where clause to the query using the specification criteria
                query = query.Where(spec.Criteria);
            }

            if (spec.OrderBy != null)
            {
                // apply the OrderBy clause to the query using the specification criteria
                query = query.OrderBy(spec.OrderBy);
            }

            if (spec.OrderByDescending != null)
            {
                // apply the OrderByDescending clause to the query using the specification criteria
                query = query.OrderByDescending(spec.OrderByDescending);
            }

            // if pagination is enabled add skip/take clause
            if (spec.IsPagingEnabled)
            {
                query = query.Skip(spec.Skip).Take(spec.Take);
            }

            // this is going to aggregate our include expressions
            // aggregating necessary includes to our query which is going to be an IQueryable that we then pass to a list or method
            // so then it can query the database and return a result based on what's contained in here
            query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));

            return query;
        }
    }
}