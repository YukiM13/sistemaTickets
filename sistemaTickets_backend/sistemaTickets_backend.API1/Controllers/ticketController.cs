using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using sistemaTickets_backend.API1.Helpers;
using sistemaTickets_backend.API1.ViewModels;
using sistemaTickets_backend.BusinessLogic.Services;
using sistemaTickets_backend.Entities.Entities;

namespace sistemaTickets_backend.API1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiKey]
    public class ticketController : Controller
    {
        private readonly ticketServices _ticketServices;
        public readonly IMapper _mapper;
        public ticketController(ticketServices ticketServices, IMapper mapper)
        {
            _ticketServices = ticketServices;
            _mapper = mapper;
        }

        [HttpGet("Listar")]
        public async Task<IActionResult> ListarTickets()
        {
            var list = await _ticketServices.ListarTickets();
            return Ok(list);
        }

        [HttpPost("Insertar")]
        public async Task<IActionResult> InsertarTickets([FromBody] ticketsViewModel_insert ticket)
        {
            var mapped = _mapper.Map<tickets>(ticket);
            var result = await _ticketServices.InsertarTicket(mapped);
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
        public async Task<IActionResult> ActualizarTicket([FromBody] ticketsViewModel_update ticket)
        {
            var mapped = _mapper.Map<tickets>(ticket);
            var result = await _ticketServices.ActualizarTicket(mapped);
            if (result.Success)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }

        [HttpPut("Tomar")]
        public async Task<IActionResult> TomarTicket([FromBody] ticketsViewModel_updateEstado ticket)
        {
            var mapped = _mapper.Map<tickets>(ticket);
            var result = await _ticketServices.Asignar_CambioEstado(mapped);
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

        public async Task<IActionResult> EliminarTicket([FromBody] ticketsViewModel_delete ticket)
        {
            var mapped = _mapper.Map<tickets>(ticket);
            var result = await _ticketServices.EliminarTicket(mapped);
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
