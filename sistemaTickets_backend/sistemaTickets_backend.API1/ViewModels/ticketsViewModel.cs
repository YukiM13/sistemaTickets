namespace sistemaTickets_backend.API1.ViewModels
{
    public class ticketsViewModel_insert
    {
        public string tick_titulo { get; set; }
        public string tick_descripcion { get; set; }
        public string cate_id { get; set; }
        public int tick_estado { get; set; }
        public string tick_prioridad { get; set; }
        public string usua_creacion { get; set; }
        public DateTime tick_fechaCreacion { get; set; }

    }

    public class ticketsViewModel_update
    {
        public string Id { get; set; }
        public string tick_titulo { get; set; }
        public string tick_descripcion { get; set; }
        public string cate_id { get; set; }
        public string tick_prioridad { get; set; }
        public string? usua_modificacion { get; set; }
        public DateTime? tick_fechaModificacion { get; set; }


    }

    public class ticketsViewModel_delete
    {
        public string Id { get; set; }
    }

    public class ticketsViewModel_updateEstado
    {
        public string Id { get; set; }
        public string usua_encargadoId { get;set; }
        public int tick_estado { get;set; }
        public string usua_modificacion { get;set; }
        public DateTime? tick_fechaModificacion { get; set; }
    }

}
