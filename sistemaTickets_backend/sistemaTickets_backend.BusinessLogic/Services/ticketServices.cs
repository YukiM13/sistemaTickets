using sistemaTickets_backend.DataAccess.Repositorys;
using sistemaTickets_backend.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sistemaTickets_backend.BusinessLogic.Services
{
    public class ticketServices
    {
        private readonly ticketsRepository _ticketsRepository;

        public ticketServices(ticketsRepository ticketsRepository)
        {
            _ticketsRepository = ticketsRepository;
        }

        public async Task<IEnumerable<tickets>> ListarTickets()
        {
            try
            {
                return await _ticketsRepository.List();
            }
            catch (Exception ex)
            {
                //Retornar lista vacia si hay algun problema
                return Enumerable.Empty<tickets>();
            }
        }

        public async Task<ServiceResult> InsertarTicket(tickets ticket)
        {
            var result = new ServiceResult();
            try
            {
                // Insertar ticket en el repositorio
                var repoResult = await _ticketsRepository.Insert(ticket);
                if (repoResult.CodeStatus == 1)
                {
                    // Si el repositorio devolvió éxito, respondemos con Ok
                    return result.Ok(repoResult.MessageStatus, ticket);
                }
                else
                {
                    // Si hubo algún error lógico, devolvemos advertencia o error controlado
                    return result.Warning(repoResult.MessageStatus);
                }
            }
            catch (Exception ex)
            {
                // Si ocurre una excepción real, devolvemos error del sistema
                return result.Error($"Error al insertar ticket: {ex.Message}");
            }
        }

        public async Task<ServiceResult> ActualizarTicket(tickets ticket)
        {
            var result = new ServiceResult();
            try
            {
                // Actualizar ticket en el repositorio
                var repoResult = await _ticketsRepository.Update(ticket);
                if (repoResult.CodeStatus == 1)
                {
                    // Si el repositorio devolvió éxito, respondemos con Ok
                    return result.Ok(repoResult.MessageStatus, ticket);
                }
                else
                {
                    // Si hubo algún error lógico, devolvemos advertencia o error controlado
                    return result.Warning(repoResult.MessageStatus);
                }
            }
            catch (Exception ex)
            {
                // Si ocurre una excepción real, devolvemos error del sistema
                return result.Error($"Error al actualizar ticket: {ex.Message}");
            }
        }

        public async Task<ServiceResult> EliminarTicket(tickets ticket)
        {
            var result = new ServiceResult();
            try
            {
                // Eliminar ticket en el repositorio
                var repoResult = await _ticketsRepository.Delete(ticket);
                if (repoResult.CodeStatus == 1)
                {
                    // Si el repositorio devolvió éxito, respondemos con Ok
                    return result.Ok(repoResult.MessageStatus);
                }
                else
                {
                    // Si hubo algún error lógico, devolvemos advertencia o error controlado
                    return result.Warning(repoResult.MessageStatus);
                }
            }
            catch (Exception ex)
            {
                // Si ocurre una excepción real, devolvemos error del sistema
                return result.Error($"Error al eliminar ticket: {ex.Message}");
            }
        }

        public async Task<ServiceResult> Asignar_CambioEstado(tickets ticket)
        {
            var result = new ServiceResult();
            try
            {
                // Actualizar ticket en el repositorio
                var repoResult = await _ticketsRepository.UpdateEncargado(ticket);
                if (repoResult.CodeStatus == 1)
                {
                    // Si el repositorio devolvió éxito, respondemos con Ok
                    return result.Ok(repoResult.MessageStatus, ticket);
                }
                else
                {
                    // Si hubo algún error lógico, devolvemos advertencia o error controlado
                    return result.Warning(repoResult.MessageStatus);
                }
            }
            catch (Exception ex)
            {
                // Si ocurre una excepción real, devolvemos error del sistema
                return result.Error($"Error al actualizar ticket: {ex.Message}");
            }
        }
    }
}
