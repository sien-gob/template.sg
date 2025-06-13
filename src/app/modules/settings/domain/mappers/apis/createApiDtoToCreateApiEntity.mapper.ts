import { IMapper } from 'src/app/modules/mappers/domain/models';
import { ApiDto } from '../../dtos';
import { CreateApiDto } from '../../dtos/Apis/createApi.dto';
import { CreateApiEntity } from '../../entities/Apis/createApi.entity';

export class CreateApiDtoToCreateApiEntityMapper implements IMapper<CreateApiDto, CreateApiEntity> {
  async mapping(input: CreateApiDto): Promise<CreateApiEntity> {
    return CreateApiDtoToCreateApiEntityMapper.map(input);
  }

  static async map(input: CreateApiDto): Promise<CreateApiEntity> {
    return new CreateApiEntity({
      ...input,
    });
  }

  static async maps(inputs: CreateApiDto[]): Promise<CreateApiEntity[]> {
    return Promise.all(inputs.map((item) => CreateApiDtoToCreateApiEntityMapper.map(item)));
  }
}
