using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Google.Cloud.Firestore;
using sistemaTickets_backend.Entities.Entities;
using FirebaseAdmin.Auth;

namespace sistemaTickets_backend.DataAccess.Repositorys
{
    public class usuariosRepository : IRepository<usuarios>
    {
        private readonly FirestoreDb _firebaseContext;
        private readonly CollectionReference _usuariosCollection;

        //Inyeccion de la conexion a firebase
        public usuariosRepository(FirebaseContext firebaseContext)
        {
            _firebaseContext = firebaseContext.Firestore;
            _usuariosCollection = _firebaseContext.Collection("usuarios");
        }

        public Task<RequestStatus> Delete(usuarios item)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<usuarios>> Find(usuarios? item)
        {
            throw new NotImplementedException();
        }

        public Task<RequestStatus> Insert(usuarios item)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<usuarios>> List()
        {
            var usuariosList = new List<usuarios>();

            QuerySnapshot snapshot = await _usuariosCollection.GetSnapshotAsync();

            foreach (var doc in snapshot.Documents)
            {
                var usuario = doc.ConvertTo<usuarios>();
                usuario.Id = doc.Id; // UID de Auth

                // Traer información desde Firebase Auth
                try
                {
                    var userRecord = await FirebaseAuth.DefaultInstance.GetUserAsync(usuario.Id);
                    usuario.Email = userRecord.Email; // Email desde Auth
                }
                catch
                {
                    usuario.Email = null; // Por si el UID no existe en Auth
                }
                if (!string.IsNullOrEmpty(usuario.role_id))
                {
                    var roleId = usuario.role_id.Trim(); // Elimina espacios al inicio y al final
                    var roleDoc = await _firebaseContext.Collection("roles")
                                                        .Document(roleId)
                                                        .GetSnapshotAsync();

                    if (roleDoc.Exists)
                    {
                        // Supongamos que tu documento de rol tiene un campo "role_nombre"
                        usuario.role_nombre = roleDoc.GetValue<string>("role_nombre");
                    }
                    else
                    {
                        usuario.role_nombre = null; // Por si no existe el rol
                    }
                }

                usuariosList.Add(usuario);
            }

            return usuariosList;
        }

        public Task<RequestStatus> Update(usuarios item)
        {
            throw new NotImplementedException();
        }
    }
}
