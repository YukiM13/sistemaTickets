using Google.Cloud.Firestore;
using System;

namespace sistemaTickets_backend.Entities.Entities
{
    [FirestoreData] // Indica que esta clase se puede mapear a Firestore
    public class usuarios
    {
        [FirestoreDocumentId] 
        public string Id { get; set; }

        [FirestoreProperty]
        public string usua_usuario { get; set; }

       // Email viene de Firebase Auth
        public string Email { get; set; }

       // Password viene de Firebase Auth
        public string Password { get; set; }

        [FirestoreProperty]
        public string role_id { get; set; }

        public string role_nombre { get; set; }

        [FirestoreProperty]
        public bool usua_EsAdmin { get; set; }

        [FirestoreProperty]
        public string usua_creacion { get; set; }

        [FirestoreProperty]
        public string? usua_modificacion { get; set; }

        [FirestoreProperty]
        public DateTime usua_fechaCreacion { get; set; }

        [FirestoreProperty]
        public DateTime? usua_fechaModificacion { get; set; }
        public string usuaC_usuario { get; set; }

        public string usuaM_usuario { get; set; }

        public string Token { get; set; }

        // Constructor vacío obligatorio para Firestore
        public usuarios() { }
    }
}
