using Google.Cloud.Firestore;

namespace sistemaTickets_backend.API1.ViewModels
{
    public class usuariosViewModel_Insert
    {
        public string Id { get; set; }
        public string usua_usuario { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string role_id { get; set; }
        public bool usua_EsAdmin { get; set; }
        public string usua_creacion { get; set; }
        public DateTime usua_fechaCreacion { get; set; }
    }

    public class usuariosViewModel_Update
    {
        public string Id { get; set; }
        public string usua_usuario { get; set; }
        public string role_id { get; set; }
        public bool usua_EsAdmin { get; set; }
        public string? usua_modificacion { get; set; }
        public DateTime? usua_fechaModificacion { get; set; }
    }
}
