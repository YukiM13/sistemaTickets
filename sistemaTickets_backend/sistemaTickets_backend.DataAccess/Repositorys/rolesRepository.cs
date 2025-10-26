using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Google.Cloud.Firestore;
using sistemaTickets_backend.Entities.Entities;

namespace sistemaTickets_backend.DataAccess.Repositorys
{
    public class rolesRepository : IRepository<roles>
    {
        private readonly FirestoreDb _firebaseContext;
        private readonly CollectionReference _rolesCollection;

        //Inyeccion de la conexion a firebase
        public rolesRepository(FirebaseContext firebaseContext)
        {
            _firebaseContext = firebaseContext.Firestore;
            _rolesCollection = _firebaseContext.Collection("roles");
        }


        public Task<RequestStatus> Delete(roles item)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<roles>> Find(roles? item)
        {
            throw new NotImplementedException();
        }

        public Task<RequestStatus> Insert(roles item)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<roles>> List()
        {
            var rolesList = new List<roles>();

            QuerySnapshot snapshot = await _rolesCollection.GetSnapshotAsync();

            foreach (var doc in snapshot.Documents)
            {
                var rol = doc.ConvertTo<roles>();




                rolesList.Add(rol);
            }

            return rolesList;
        }

        public Task<RequestStatus> Update(roles item)
        {
            throw new NotImplementedException();
        }
    }
}
