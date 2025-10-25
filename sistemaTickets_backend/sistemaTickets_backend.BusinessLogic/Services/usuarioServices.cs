using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using sistemaTickets_backend.DataAccess.Repositorys;
using sistemaTickets_backend.Entities.Entities;

namespace sistemaTickets_backend.BusinessLogic.Services
{
    public class usuarioServices
    {
        private readonly usuariosRepository _usuarioRepository;
        public usuarioServices(usuariosRepository usuariosRepository )
        {
            _usuarioRepository = usuariosRepository;
        }

        public async Task<IEnumerable<usuarios>> ListarUsuarios()
        {
            try
            {
                return await _usuarioRepository.List();
            }
            catch (Exception ex)
            {
                //Retornar lista vacia si hay algun problema
                return Enumerable.Empty<usuarios>();
            }
        }

        public async Task<ServiceResult> InsertarUsuario(usuarios usuario)
        {
            var result = new ServiceResult();

            try
            {
                // Insertar usuario en el repositorio
                var repoResult = await _usuarioRepository.Insert(usuario);

                if (repoResult.CodeStatus == 1)
                {
                    // Si el repositorio devolvió éxito, respondemos con Ok
                    return result.Ok(repoResult.MessageStatus, usuario);
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
                return result.Error($"Error al insertar usuario: {ex.Message}");
            }
        }


        public async Task<ServiceResult> ActualizarUsuario(usuarios usuario)
        {
            var result = new ServiceResult();

            try
            {
                // Actualizar usuario en el repositorio
                var repoResult = await _usuarioRepository.Update(usuario);

                if (repoResult.CodeStatus == 1)
                {
                    // Si el repositorio devolvió éxito, respondemos con Ok
                    return result.Ok(repoResult.MessageStatus, usuario);
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
                return result.Error($"Error al insertar usuario: {ex.Message}");
            }
        }
    }
}
