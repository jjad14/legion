using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity
{
    public class User : IdentityUser<int>
    {
        public string DisplayName { get; set; }
        public Address Address { get; set; }
        public ICollection<UserRole> UserRoles { get; set; }
    }
}