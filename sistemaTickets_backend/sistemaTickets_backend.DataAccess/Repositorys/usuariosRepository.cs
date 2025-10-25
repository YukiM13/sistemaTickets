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

        public async Task<RequestStatus> Insert(usuarios item)
        {
            try
            {
                //Crear el usuario en Firebase Auth
                var userRecordArgs = new UserRecordArgs()
                {
                    Email = item.Email,
                    Password = item.Password
                };

                UserRecord userRecord = await FirebaseAuth.DefaultInstance.CreateUserAsync(userRecordArgs);

                //Guardar en Firestore con el UID como ID del documento
                item.Id = userRecord.Uid;
                item.usua_fechaCreacion = DateTime.UtcNow;
                item.usua_fechaModificacion = DateTime.UtcNow;
                item.usua_modificacion = "";


                await _usuariosCollection.Document(userRecord.Uid).SetAsync(item);

                return new RequestStatus { CodeStatus = 1, MessageStatus = "Usuario creado correctamente" };
            }
            catch (Exception ex)
            {
                return new RequestStatus { CodeStatus = 0, MessageStatus = $"Error al insertar usuario: {ex.Message}" };
            }
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
                //Traer nombres de usuarios que crearon y modificaron
                if (!string.IsNullOrEmpty(usuario.usua_creacion))
                {
                    var creadorDoc = await _usuariosCollection.Document(usuario.usua_creacion).GetSnapshotAsync();
                    usuario.usuaC_usuario = creadorDoc.Exists
                        ? creadorDoc.GetValue<string>("usua_usuario")
                        : null;
                }
                else
                {
                    usuario.usuaC_usuario = null;
                }

           
                if (!string.IsNullOrEmpty(usuario.usua_modificacion))
                {
                    var modificadorDoc = await _usuariosCollection.Document(usuario.usua_modificacion).GetSnapshotAsync();
                    usuario.usuaM_usuario = modificadorDoc.Exists
                        ? modificadorDoc.GetValue<string>("usua_usuario")
                        : null;
                }
                else
                {
                    usuario.usuaM_usuario = null;
                }



                usuariosList.Add(usuario);
            }

            return usuariosList;
        }

        public async Task<RequestStatus> Update(usuarios item)
        {
            try
            {
                var userDoc = _usuariosCollection.Document(item.Id);

                var snapshot = await userDoc.GetSnapshotAsync();
                if (!snapshot.Exists)
                    return new RequestStatus { CodeStatus = 0, MessageStatus = "Usuario no encontrado" };

                // Forzar que las fechas sean UTC
                item.usua_fechaModificacion = DateTime.UtcNow;

                var updateData = new Dictionary<string, object>
                {
                    { "usua_usuario", item.usua_usuario },
                    { "role_id", item.role_id },
                    { "usua_EsAdmin", item.usua_EsAdmin },
                    { "usua_modificacion", item.usua_modificacion ?? "" },
                    { "usua_fechaModificacion", Timestamp.FromDateTime(item.usua_fechaModificacion.Value) }
                };

                await userDoc.UpdateAsync(updateData);

                return new RequestStatus { CodeStatus = 1, MessageStatus = "Usuario actualizado correctamente" };
            }
            catch (Exception ex)
            {
                return new RequestStatus { CodeStatus = 0, MessageStatus = $"Error al actualizar usuario: {ex.Message}" };
            }
        }
    }
}
