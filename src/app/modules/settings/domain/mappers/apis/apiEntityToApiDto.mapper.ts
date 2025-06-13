import { IMapper } from 'src/app/modules/mappers/domain/models';
import { ApiEntity } from '../../entities';
import { ApiDto } from '../../dtos';

export class ApiEntityToApiDtoMapper implements IMapper<ApiEntity, ApiDto> {
  async mapping(input: ApiEntity): Promise<ApiDto> {
    return ApiEntityToApiDtoMapper.map(input);
  }

  static async map(input: ApiEntity): Promise<ApiDto> {
    return new ApiDto({
      ...input,
    });
  }

  static async maps(inputs: ApiEntity[]): Promise<ApiDto[]> {
    return Promise.all(inputs.map((item) => ApiEntityToApiDtoMapper.map(item)));
  }
}
