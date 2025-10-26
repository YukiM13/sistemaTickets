using Google.Cloud.Firestore;
using sistemaTickets_backend.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sistemaTickets_backend.DataAccess.Repositorys
{

    public class ticketsRepository : IRepository<tickets>
    {
        private readonly FirestoreDb _firebaseContext;
        private readonly CollectionReference _ticketsCollection;

        //Inyeccion de la conexion a firebase
        public ticketsRepository(FirebaseContext firebaseContext)
        {
            _firebaseContext = firebaseContext.Firestore;
            _ticketsCollection = _firebaseContext.Collection("tickets");
        }
        public async Task<RequestStatus> Delete(tickets item)
        {
            try
            {
                var docRef = _ticketsCollection.Document(item.Id);

                if (!(await docRef.GetSnapshotAsync()).Exists)
                    return new RequestStatus { CodeStatus = 0, MessageStatus = "Ticket no encontrado" };

                await docRef.DeleteAsync();

                return new RequestStatus { CodeStatus = 1, MessageStatus = "Ticket eliminado correctamente" };
            }
            catch (Exception ex)
            {
                return new RequestStatus { CodeStatus = 0, MessageStatus = $"Error al eliminar ticket: {ex.Message}" };
            }
        }

        public Task<IEnumerable<tickets>> Find(tickets? item)
        {
            throw new NotImplementedException();
        }

        public async Task<RequestStatus> Insert(tickets item)
        {
            try
            {
                var docRef = _ticketsCollection.Document(); // ID automático
                item.tick_fechaCreacion = DateTime.UtcNow;
                item.tick_fechaModificacion = null;
                item.usua_modificacion = null;

                await docRef.SetAsync(item);

                return new RequestStatus { CodeStatus = 1, MessageStatus = "Ticket creado correctamente" };
            }
            catch (Exception ex)
            {
                return new RequestStatus { CodeStatus = 0, MessageStatus = $"Error al insertar ticket: {ex.Message}" };
            }
        }

        public async Task<IEnumerable<tickets>> List()
        {
            var ticketsList = new List<tickets>();

            QuerySnapshot snapshot = await _ticketsCollection.GetSnapshotAsync();

            foreach (var doc in snapshot.Documents)
            {
                var ticket = doc.ConvertTo<tickets>();
                ticket.Id = doc.Id; 

                // Traer nombres de usuarios que crearon y modificaron
                if (!string.IsNullOrEmpty(ticket.usua_creacion))
                {
                    var creadorDoc = await _firebaseContext.Collection("usuarios")
                                                           .Document(ticket.usua_creacion)
                                                           .GetSnapshotAsync();
                    ticket.usuaC_usuario = creadorDoc.Exists
                        ? creadorDoc.GetValue<string>("usua_usuario")
                        : null;
                }
                else
                {
                    ticket.usuaC_usuario = null;
                }

                if (!string.IsNullOrEmpty(ticket.usua_modificacion))
                {
                    var modificadorDoc = await _firebaseContext.Collection("usuarios")
                                                               .Document(ticket.usua_modificacion)
                                                               .GetSnapshotAsync();
                    ticket.usuaM_usuario = modificadorDoc.Exists
                        ? modificadorDoc.GetValue<string>("usua_usuario")
                        : null;
                }
                else
                {
                    ticket.usuaM_usuario = null;
                }

                // Traer nombre del encargado si hay
                if (!string.IsNullOrEmpty(ticket.usua_encargadoId))
                {
                    var encargadoDoc = await _firebaseContext.Collection("usuarios")
                                                             .Document(ticket.usua_encargadoId)
                                                             .GetSnapshotAsync();
                    ticket.usua_encargadoNombre = encargadoDoc.Exists
                        ? encargadoDoc.GetValue<string>("usua_usuario")
                        : null;
                }
                else
                {
                    ticket.usua_encargadoNombre = null;
                }

                // Traer nombre de la categoría
                if (!string.IsNullOrEmpty(ticket.cate_id))
                {
                    var cateDoc = await _firebaseContext.Collection("categorias")
                                                        .Document(ticket.cate_id)
                                                        .GetSnapshotAsync();
                    ticket.cate_nombre = cateDoc.Exists
                        ? cateDoc.GetValue<string>("cate_nombre")
                        : null;
                }
                else
                {
                    ticket.cate_nombre = null;
                }

                ticketsList.Add(ticket);
            }

            return ticketsList;
        }

        public async Task<RequestStatus> Update(tickets item)
        {
            try
            {
                // Obtener el documento por ID
                var docRef = _ticketsCollection.Document(item.Id.ToString());
                var snapshot = await docRef.GetSnapshotAsync();

                if (!snapshot.Exists)
                {
                    return new RequestStatus
                    {
                        CodeStatus = 0,
                        MessageStatus = "Ticket no encontrado"
                    };
                }

                // Actualizar campos modificables
                item.tick_fechaModificacion = DateTime.UtcNow;

                var updateData = new Dictionary<string, object>
                {
                    { "tick_titulo", item.tick_titulo },
                    { "tick_descripcion", item.tick_descripcion },
                    { "cate_id", item.cate_id },
                    { "tick_prioridad", item.tick_prioridad },
                    { "usua_modificacion", item.usua_modificacion },
                    { "tick_fechaModificacion", item.tick_fechaModificacion }
                };

                await docRef.UpdateAsync(updateData);

                return new RequestStatus
                {
                    CodeStatus = 1,
                    MessageStatus = "Ticket actualizado correctamente"
                };
            }
            catch (Exception ex)
            {
                return new RequestStatus
                {
                    CodeStatus = 0,
                    MessageStatus = $"Error al actualizar ticket: {ex.Message}"
                };
            }
        }

        public async Task<RequestStatus> UpdateEncargado(tickets item)
        {
            try
            {
                // Obtener el documento por ID
                var docRef = _ticketsCollection.Document(item.Id.ToString());
                var snapshot = await docRef.GetSnapshotAsync();
                if (!snapshot.Exists)
                {
                    return new RequestStatus
                    {
                        CodeStatus = 0,
                        MessageStatus = "Ticket no encontrado"
                    };
                }
                // Actualizar el encargado
                var updateData = new Dictionary<string, object>
                {
                    { "usua_encargadoId", item.usua_encargadoId },
                    { "tick_estado", item.tick_estado },
                    { "usua_modificacion", item.usua_modificacion},
                    { "tick_fechaModificacion", DateTime.UtcNow }
                };
                await docRef.UpdateAsync(updateData);
                return new RequestStatus
                {
                    CodeStatus = 1,
                    MessageStatus = "Ticket tomado correctamente"
                };
            }
            catch (Exception ex)
            {
                return new RequestStatus
                {
                    CodeStatus = 0,
                    MessageStatus = $"Error al actualizar encargado del ticket: {ex.Message}"
                };
            }
        }
    }
}
