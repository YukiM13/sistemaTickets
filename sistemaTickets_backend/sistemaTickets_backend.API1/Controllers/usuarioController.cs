using AutoMapper;
using Google.Api;
using Microsoft.AspNetCore.Mvc;
using sistemaTickets_backend.API1.ViewModels;
using sistemaTickets_backend.BusinessLogic.Services;
using sistemaTickets_backend.Entities.Entities;

namespace sistemaTickets_backend.API1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class usuarioController : Controller
    {
        private readonly usuarioServices _usuarioServices;
        public readonly IMapper _mapper;
        public usuarioController(usuarioServices usuarioServices, IMapper mapper)
        {
            _usuarioServices = usuarioServices;
            _mapper = mapper;
        }

        [HttpGet("Listar")]
        public async Task<IActionResult> ListarUsuarios()
        {
            var list = await _usuarioServices.ListarUsuarios();
            return Ok(list);

        }

        [HttpPost("Insertar")]

        public async Task<IActionResult> InsertarUsuario([FromBody] usuariosViewModel_Insert usuario)
        {
            var mapped = _mapper.Map<usuarios>(usuario);
            var result = await _usuarioServices.InsertarUsuario(mapped);
            if (result.Success)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }

        }


        [HttpPut("Actualizar")]

        public async Task<IActionResult> ActualizarUsuario([FromBody] usuariosViewModel_Update usuario)
        {
            var mapped = _mapper.Map<usuarios>(usuario);
            var result = await _usuarioServices.ActualizarUsuario(mapped);
            if (result.Success)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }

        }

    }
}
