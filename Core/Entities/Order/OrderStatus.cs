using System.Runtime.Serialization;

namespace Core.Entities.Order
{
    // what state the order is at
    public enum OrderStatus
    {
        [EnumMember(Value = "Pending")]
        Pending,
        [EnumMember(Value = "Payment Recieved")]
        PaymentReceived,
        [EnumMember(Value = "Payment Failed")]
        PaymentFailed
    }
}