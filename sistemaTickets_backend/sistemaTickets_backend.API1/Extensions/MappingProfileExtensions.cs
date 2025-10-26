using AutoMapper;
using sistemaTickets_backend.API1.ViewModels;
using sistemaTickets_backend.Entities.Entities;

namespace sistemaTickets_backend.API1.Extensions
{
    public class MappingProfileExtensions : Profile
    {
        public MappingProfileExtensions()
        {
            CreateMap<usuarios, usuariosViewModel_Insert>().ReverseMap();
            CreateMap<usuarios, usuariosViewModel_Update>().ReverseMap();
            CreateMap<usuarios, usuariosViewModel_Login>().ReverseMap();
            CreateMap<categorias, categoriasViewModel_Insert>().ReverseMap();
            CreateMap<categorias, categoriasViewModel_Update>().ReverseMap();
            CreateMap<categorias, categoriasViewModel_Delete>().ReverseMap();
            CreateMap<tickets, ticketsViewModel_insert>().ReverseMap();
            CreateMap<tickets, ticketsViewModel_update>().ReverseMap();
            CreateMap<tickets, ticketsViewModel_updateEstado>().ReverseMap();
            CreateMap<tickets,ticketsViewModel_delete>().ReverseMap();

        }
    }
}
