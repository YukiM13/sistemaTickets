using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sistemaTickets_backend.Entities.Entities
{
    [FirestoreData] // Indica que esta clase se puede mapear a Firestore
    public class roles
    {
        [FirestoreDocumentId]
        public string Id { get; set; }
        [FirestoreProperty]
        public string role_nombre { get; set; }

        public roles() { }
    }
}
