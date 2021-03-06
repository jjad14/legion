using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            if (!userManager.Users.Any())
            {
                var roles = new List<Role>
                {
                    new Role {Name = "Customer"},
                    new Role {Name = "Employee"},
                    new Role {Name = "Admin"}
                };

                foreach (var role in roles)
                {
                    await roleManager.CreateAsync(role);
                }

                var user = new User 
                {
                    DisplayName = "Administrator",
                    Email = "company@test.com",
                    UserName = "Admin",
                    Address = new Address
                    {
                        FirstName = "James",
                        LastName ="Smith",
                        Street = "10 Main Street",
                        City = "Toronto",
                        Province = "ON",
                        PostalCode = "N42 5B2"
                    }
                };

                await userManager.CreateAsync(user, "Test@1234");
                await userManager.AddToRolesAsync(user, new[] {"Admin", "Employee"});
            }
        }
    }
}