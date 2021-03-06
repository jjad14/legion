using System.Collections.Generic;

namespace Core.Entities
{
    public class CustomerCart
    {
        public CustomerCart()
        {
            
        }

        public CustomerCart(string id)
        {
            Id = id;
        }

        public string Id { get; set; }
        public List<CartItem> Items { get; set; } = new List<CartItem>();
        public int? DeliveryMethodId { get; set; }
        // this is going to be used by stripe so the user can confirm the payments intent
        public string ClientSecret { get; set; }
        // we'll use this one to be able to update the payment intent
        public string PaymentIntentId { get; set; }
        public decimal ShippingPrice { get; set; }
    }
}