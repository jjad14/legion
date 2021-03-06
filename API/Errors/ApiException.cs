namespace API.Errors
{
    public class ApiException : ApiResponse
    {
        public ApiException(int statusCode, string message = null, string details = null) 
            : base(statusCode, message)
        {
            Details = details;
        }

        // contains stack trace
        public string Details { get; set; }
    }
}