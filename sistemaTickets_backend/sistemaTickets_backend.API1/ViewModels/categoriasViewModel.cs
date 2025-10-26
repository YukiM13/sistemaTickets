namespace sistemaTickets_backend.API1.ViewModels
{
    public class categoriasViewModel_Insert
    {
        public string cate_nombre { get; set; }
        public string usua_creacion { get; set; }
        public DateTime cate_fechaCreacion { get; set; }
    }

    public class categoriasViewModel_Update
    {
        public string Id { get; set; }
        public string cate_nombre { get; set; }
        public string? usua_modificacion { get; set; }
        public DateTime? cate_fechaModificacion { get; set; }
    }

    public class categoriasViewModel_Delete
    {
        public string Id { get; set; }
    }
}
