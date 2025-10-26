using FirebaseAdmin.Auth;
using Google.Cloud.Firestore;
using sistemaTickets_backend.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sistemaTickets_backend.DataAccess.Repositorys
{
    public class categoriasRepository : IRepository<categorias>
    {
        private readonly FirestoreDb _firebaseContext;
        private readonly CollectionReference _categoriaCollection;

        //Inyeccion de la conexion a firebase
        public categoriasRepository(FirebaseContext firebaseContext)
        {
            _firebaseContext = firebaseContext.Firestore;
            _categoriaCollection = _firebaseContext.Collection("categorias");
        }
        public async Task<RequestStatus> Delete(categorias item)
        {
            try
            {
                // Obtener el documento por ID
                var docRef = _categoriaCollection.Document(item.Id);
                var snapshot = await docRef.GetSnapshotAsync();

                if (!snapshot.Exists)
                {
                    return new RequestStatus
                    {
                        CodeStatus = 0,
                        MessageStatus = "Categoría no encontrada"
                    };
                }

                // Eliminar documento
                await docRef.DeleteAsync();

                return new RequestStatus
                {
                    CodeStatus = 1,
                    MessageStatus = "Categoría eliminada correctamente"
                };
            }
            catch (Exception ex)
            {
                return new RequestStatus
                {
                    CodeStatus = 0,
                    MessageStatus = $"Error al eliminar categoría: {ex.Message}"
                };
            }
        }

        public Task<IEnumerable<categorias>> Find(categorias? item)
        {
            throw new NotImplementedException();
        }

        public async Task<RequestStatus> Insert(categorias item)
        {
            try
            {
                // Configurar fechas
                item.cate_fechaCreacion = DateTime.UtcNow;
                item.cate_fechaModificacion = null;
                item.usua_modificacion = null;

                // Guardar en Firestore y generar ID automáticamente
                DocumentReference docRef = await _categoriaCollection.AddAsync(item);

                item.Id = docRef.Id;

                return new RequestStatus { CodeStatus = 1, MessageStatus = "Categoría creada correctamente" };
            }
            catch (Exception ex)
            {
                return new RequestStatus { CodeStatus = 0, MessageStatus = $"Error al insertar categoría: {ex.Message}" };
            }
        }

        public async Task<IEnumerable<categorias>> List()
        {
            var categoriaList = new List<categorias>();

            QuerySnapshot snapshot = await _categoriaCollection.GetSnapshotAsync();

            foreach (var doc in snapshot.Documents)
            {
                var categoria = doc.ConvertTo<categorias>();
               
                
                //Traer nombres de usuarios que crearon y modificaron
                if (!string.IsNullOrEmpty(categoria.usua_creacion))
                {
                    var creadorDoc = await _firebaseContext.Collection("usuarios").Document(categoria.usua_creacion).GetSnapshotAsync();
                    categoria.usuaC_usuario = creadorDoc.Exists
                        ? creadorDoc.GetValue<string>("usua_usuario")
                        : null;
                }
                else
                {
                    categoria.usuaC_usuario = null;
                }


                if (!string.IsNullOrEmpty(categoria.usua_modificacion))
                {
                    var modificadorDoc = await _firebaseContext.Collection("usuarios").Document(categoria.usua_modificacion).GetSnapshotAsync();
                    categoria.usuaM_usuario = modificadorDoc.Exists
                        ? modificadorDoc.GetValue<string>("usua_usuario")
                        : null;
                }
                else
                {
                    categoria.usuaM_usuario = null;
                }



                categoriaList.Add(categoria);
            }

            return categoriaList;
        }

        public async Task<RequestStatus> Update(categorias item)
        {
            try
            {
                // Obtener el documento por ID
                var docRef = _categoriaCollection.Document(item.Id);
                var snapshot = await docRef.GetSnapshotAsync();

                if (!snapshot.Exists)
                {
                    return new RequestStatus
                    {
                        CodeStatus = 0,
                        MessageStatus = "Categoría no encontrada"
                    };
                }

                // Actualizar campos modificables
                item.cate_fechaModificacion = DateTime.UtcNow;

                var updateData = new Dictionary<string, object>
                {
                    { "cate_nombre", item.cate_nombre },
                    { "usua_modificacion", item.usua_modificacion },
                    { "cate_fechaModificacion", item.cate_fechaModificacion }
                };

                await docRef.UpdateAsync(updateData);

   

                return new RequestStatus
                {
                    CodeStatus = 1,
                    MessageStatus = "Categoría actualizada correctamente"
                };
            }
            catch (Exception ex)
            {
                return new RequestStatus
                {
                    CodeStatus = 0,
                    MessageStatus = $"Error al actualizar categoría: {ex.Message}"
                };
            }
        }
    }
}
