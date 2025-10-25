using Google.Api;
using Microsoft.AspNetCore.Mvc;
using sistemaTickets_backend.BusinessLogic.Services;

namespace sistemaTickets_backend.API1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class usuarioController : Controller
    {
        private readonly usuarioServices _usuarioServices;

        public usuarioController(usuarioServices usuarioServices)
        {
            _usuarioServices = usuarioServices;
        }

        [HttpGet("Listar")]
        public async Task<IActionResult> ListarUsuarios()
        {
            var list = await _usuarioServices.ListarUsuarios();
            return Ok(list);

        }
    }
}
