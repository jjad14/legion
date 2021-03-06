namespace API.Dtos
{
    public class OrderDto
    {
        public string CartId { get; set; }
        public int DeliveryMethodId { get; set; }
        public AddressToReturnDto ShipToAddress { get; set; }
    }
}