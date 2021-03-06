using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity
{
    public class Role : IdentityRole<int>
    {
        public ICollection<UserRole> UserRoles { get; set; }
    }
}