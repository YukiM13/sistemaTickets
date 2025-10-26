using sistemaTickets_backend.DataAccess.Repositorys;
using sistemaTickets_backend.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sistemaTickets_backend.BusinessLogic.Services
{
    public class rolServices
    {
        private readonly rolesRepository _rolesRepository;

        public rolServices(rolesRepository rolesRepository)
        {
            _rolesRepository = rolesRepository;
        }

        public async Task<IEnumerable<roles>> ListarRoles()
        {
            try
            {
                return await _rolesRepository.List();
            }
            catch (Exception ex)
            {
                //Retornar lista vacia si hay algun problema
                return Enumerable.Empty<roles>();
            }
        }
    }
}
