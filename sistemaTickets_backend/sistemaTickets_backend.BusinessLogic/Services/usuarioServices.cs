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
                // Loguea el error si quieres
                return Enumerable.Empty<usuarios>();
            }
        }
    }
}
