namespace Core.Entities.Order
{
    // allow the user to choose what sort of delivery method
    public class DeliveryMethod : BaseEntity
    {
        public string ShortName { get; set; }
        public string DeliveryTime { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; } 
    }
}