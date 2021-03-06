namespace Core.Entities.Order
{
    // allows us to take a snapshot of the product item that was ordered
    // product image/desc/price could change so we want to keep order as it was made
    public class ProductItemOrder
    {
        public ProductItemOrder()
        {
        }
        public ProductItemOrder(int productItemId, string productName, string pictureUrl)
        {
            ProductItemId = productItemId;
            ProductName  = productName;
            PictureUrl = pictureUrl;
        }

        public int ProductItemId { get; set; }
        public string ProductName { get; set; }
        public string PictureUrl { get; set; }
    }
}