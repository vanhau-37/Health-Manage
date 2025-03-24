using AutoMapper;
using health_backend.Models.Dtos;
using health_backend.Models.EntityModels;
using health_backend.Models.RequestModels;

namespace health_backend
{
	public class MappingProfiles : Profile
	{
		public MappingProfiles()
		{
			CreateMap<Disease, DiseaseDto>();
			CreateMap<Symptom, SymptomDto>();			
			CreateMap<SymptomDto, Symptom>().ForMember(x => x.ListDisease, y => y.Ignore());
			CreateMap<User, UserDto>();
			CreateMap<RegisterRequestModel, User>().ForMember(x => x.Password, y => y.Ignore());
		}
	}
}
