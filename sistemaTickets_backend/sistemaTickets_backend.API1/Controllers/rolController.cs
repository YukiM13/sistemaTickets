using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using sistemaTickets_backend.API1.Helpers;
using sistemaTickets_backend.BusinessLogic.Services;

namespace sistemaTickets_backend.API1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiKey]
    public class rolController : Controller
    {
        private readonly rolServices _rolServices;

        public rolController(rolServices rolServices)
        {
            _rolServices = rolServices;

        }

        [HttpGet("Listar")]
        public async Task<IActionResult> ListarRoles()
        {
            var list = await _rolServices.ListarRoles();
            return Ok(list);
        }
    }
}
