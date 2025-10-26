using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sistemaTickets_backend.API1.Helpers
{
    public interface IApiKeyValidator
    {
        public bool IsValid(string apikey);
    }
}