using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sistemaTickets_backend.Entities.Entities
{
    [FirestoreData] // Indica que esta clase se puede mapear a Firestore
    public class tickets
    {
        [FirestoreDocumentId]
        public int Id { get; set; }

        [FirestoreProperty]
        public string tick_titulo { get; set; }

        [FirestoreProperty]
        public string tick_descripcion { get; set; }

        [FirestoreProperty]
        public string cate_id { get; set; }
        public string cate_nombre { get; set; }

        [FirestoreProperty]
        public string usua_encargadoId { get; set; }

        public string usua_encargadoNombre { get; set; }

        [FirestoreProperty]
        public int tick_estado { get; set; }

        [FirestoreProperty]
        public string tick_prioridad { get; set; }

        [FirestoreProperty]
        public string usua_creacion { get; set; }

        [FirestoreProperty]
        public DateTime tick_fechaCreacion { get; set; }

        [FirestoreProperty]
        public string? usua_modificacion { get; set; }

        [FirestoreProperty]
        public DateTime? tick_fechaModificacion { get; set; }

        public string usuaC_usuario { get; set; }

        public string usuaM_usuario { get; set; }

        // Constructor vacío obligatorio para Firestore
        public tickets() { }



    }
}
