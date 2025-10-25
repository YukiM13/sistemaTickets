using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using sistemaTickets_backend.API1.ViewModels;
using sistemaTickets_backend.BusinessLogic.Services;
using sistemaTickets_backend.Entities.Entities;
using System.Security.Principal;

namespace sistemaTickets_backend.API1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class categoriaController : Controller
    {
        private readonly categoriaServices _categoriaServices;
        public readonly IMapper _mapper;
        public categoriaController(categoriaServices categoriaServices, IMapper mapper)
        {
            _categoriaServices = categoriaServices;
            _mapper = mapper;
        }
        [HttpGet("Listar")]
        public async Task<IActionResult> ListarCategorias()
        {
            var list = await _categoriaServices.ListarCategorias();
            return Ok(list);
        }

        [HttpPost("Insertar")]
        public async Task<IActionResult> InsertarCategoria([FromBody] categoriasViewModel_Insert categoria)
        {
            var mapped = _mapper.Map<categorias>(categoria);
            var result = await _categoriaServices.InsertarCategoria(mapped);
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
        public async Task<IActionResult> ActualizarCategoria([FromBody] categoriasViewModel_Update categoria)
        {
            var mapped = _mapper.Map<categorias>(categoria);
            var result = await _categoriaServices.ActualizarCategoria(mapped);
            if (result.Success)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }

        [HttpDelete("Eliminar")]

        public async Task<IActionResult> EliminarCategoria([FromBody] categoriasViewModel_Delete categoria)
        {
            var mapped = _mapper.Map<categorias>(categoria);
            var result = await _categoriaServices.EliminarCategoria(mapped);
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
