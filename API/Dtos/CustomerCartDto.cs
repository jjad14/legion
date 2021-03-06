using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class CustomerCartDto
    {
        [Required]
        public string Id { get; set; }
        public List<CartItemDto> Items { get; set; }
        public int? DeliveryMethodId { get; set; }
        // this is going to be used by stripe so the user can confirm the payments intent
        public string ClientSecret { get; set; }
        // we'll use this one to be able to update the payment intent
        public string PaymentIntentId { get; set; }
        public decimal ShippingPrice { get; set; }

    }
}