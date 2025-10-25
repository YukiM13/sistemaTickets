using Google.Cloud.Firestore;
using System;

namespace sistemaTickets_backend.Entities.Entities
{
    [FirestoreData] // Indica que esta clase se puede mapear a Firestore
    public class categorias
    {
        [FirestoreDocumentId]
        public string Id { get; set; }

        [FirestoreProperty]
        public string cate_nombre { get; set; }

        [FirestoreProperty]
        public string usua_creacion { get; set; }

        [FirestoreProperty]
        public string? usua_modificacion { get; set; }

        [FirestoreProperty]
        public DateTime cate_fechaCreacion { get; set; }

        [FirestoreProperty]
        public DateTime? cate_fechaModificacion { get; set; }
        public string usuaC_usuario { get; set; }

        public string usuaM_usuario { get; set; }

        // Constructor vacío obligatorio para Firestore
        public categorias() { }
    }
}
