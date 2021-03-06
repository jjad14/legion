using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithTypesAndBrandsSpecification : BaseSpecification<Product>
    {

        public ProductsWithTypesAndBrandsSpecification(ProductSpecParams productParams)
            : base(x =>
                (string.IsNullOrEmpty(productParams.Search) || 
                x.Name.ToLower().Contains(productParams.Search)) &&
                (!productParams.BrandId.HasValue || x.ProductBrandId == productParams.BrandId) &&
                (!productParams.TypeId.HasValue || x.ProductTypeId == productParams.TypeId))
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
            // default ordering can be overridden below
            AddOrderBy(x => x.Name);
            ApplyPaging(
                productParams.PageSize * (productParams.PageIndex-1), 
                productParams.PageSize);

            // if sort has a value, we override the default and apply the new sorting method
            if (!string.IsNullOrEmpty(productParams.Sort)) {
                switch (productParams.Sort) 
                {
                    case "priceAsc":
                        AddOrderBy(p => p.Price);
                        break;
                    case "priceDesc":
                        AddOrderByDescending(p => p.Price);
                        break;
                    default:
                        AddOrderBy(n => n.Name);
                        break;
                }
            }
        }

        // This ctor recieves the id and creates a new instance of the base class 
        // by passing the expression as the criteria to the BaseSpecification class
        // also including some includes
        public ProductsWithTypesAndBrandsSpecification(int id) 
            : base(x => x.Id == id)
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
        }

    }
}