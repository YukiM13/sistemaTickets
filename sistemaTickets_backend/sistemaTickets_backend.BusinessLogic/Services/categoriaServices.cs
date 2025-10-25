using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using sistemaTickets_backend.DataAccess.Repositorys;
using sistemaTickets_backend.Entities.Entities;

namespace sistemaTickets_backend.BusinessLogic.Services
{
    public class categoriaServices
    {
        private readonly categoriasRepository _categoriasRepository;

        public categoriaServices(categoriasRepository categoriasRepository)
        {
            _categoriasRepository = categoriasRepository;
        }

        public async Task<IEnumerable<categorias>> ListarCategorias()
        {
            try
            {
                return await _categoriasRepository.List();
            }
            catch (Exception ex)
            {
                //Retornar lista vacia si hay algun problema
                return Enumerable.Empty<categorias>();
            }
        }

        public async Task<ServiceResult> InsertarCategoria(categorias categoria)
        {
            var result = new ServiceResult();
            try
            {
                // Insertar categoria en el repositorio
                var repoResult = await _categoriasRepository.Insert(categoria);
                if (repoResult.CodeStatus == 1)
                {
                    // Si el repositorio devolvió éxito, respondemos con Ok
                    return result.Ok(repoResult.MessageStatus, categoria);
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
                return result.Error($"Error al insertar categoría: {ex.Message}");
            }
        }

        public async Task<ServiceResult> ActualizarCategoria(categorias categoria)
        {
            var result = new ServiceResult();
            try
            {
                // Actualizar categoria en el repositorio
                var repoResult = await _categoriasRepository.Update(categoria);
                if (repoResult.CodeStatus == 1)
                {
                    // Si el repositorio devolvió éxito, respondemos con Ok
                    return result.Ok(repoResult.MessageStatus, categoria);
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
                return result.Error($"Error al actualizar categoría: {ex.Message}");
            }
        }

        public async Task<ServiceResult> EliminarCategoria(categorias categoria)
        {
            var result = new ServiceResult();
            try
            {
                // Eliminar categoria en el repositorio
                var repoResult = await _categoriasRepository.Delete(categoria);
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
                return result.Error($"Error al eliminar categoría: {ex.Message}");
            }
        }
    }
}
