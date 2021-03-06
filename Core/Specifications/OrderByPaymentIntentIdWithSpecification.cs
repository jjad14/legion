using System;
using System.Linq.Expressions;
using Core.Entities.Order;

namespace Core.Specifications
{
    public class OrderByPaymentIntentIdSpecification : BaseSpecification<Order>
    {
        public OrderByPaymentIntentIdSpecification(string paymentIntentId) 
        : base(o => o.PaymentIntentId == paymentIntentId)
        {
        }
    }
}