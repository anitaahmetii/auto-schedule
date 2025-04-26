using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Security
{
    public class AuthorizationManager : IAuthorizationManager
    {
        private readonly ClaimsPrincipal calaimsPrinclipal;
        private readonly IHttpContextAccessor _contextAccessor;
        public string ClaimTypeName => "Id";

        public AuthorizationManager(ClaimsPrincipal calaimsPrinclipal, IHttpContextAccessor httpContextAccessor)
        {
            this.calaimsPrinclipal = calaimsPrinclipal;
            _contextAccessor = httpContextAccessor;

        }
        public Guid? GetUserId()
        {
            var token = GetCurrentToken();
            if (string.IsNullOrEmpty(token) || token == "null")
            {
                return null!;
            }
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token);
            var tokenS = jsonToken as JwtSecurityToken;

            var userId = tokenS.Claims.Where(x => x.Type == "sub").Select(x => x.Value).FirstOrDefault();

            return userId != null ? Guid.Parse(userId) : null;
        }

        public bool? IsAuthenticated()
        {
            return calaimsPrinclipal != null && calaimsPrinclipal?.Identity?.IsAuthenticated == true;

        }

        private string GetCurrentToken()
        {
            var token = _contextAccessor.HttpContext?.Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(token))
            {
                var query = _contextAccessor.HttpContext?.Request.Query["access_token"];
                if (query.HasValue)
                {
                    return query.Value;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return token.Split(" ")[1];
            }
        }
    }
}