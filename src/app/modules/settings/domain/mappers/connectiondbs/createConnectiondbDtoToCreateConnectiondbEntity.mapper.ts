import { IMapper } from 'src/app/modules/mappers/domain/models';
import { CreateConnectiondbDto } from '../../dtos/Connectiondbs/createConnectiondb.dto';
import { CreateConnectiondbEntity } from '../../entities/Connectiondbs/createConnectiondb.entity';

export class CreateConnectiondbDtoToCreateConnectiondbEntityMapper implements IMapper<CreateConnectiondbDto, CreateConnectiondbEntity> {
  async mapping(input: CreateConnectiondbDto): Promise<CreateConnectiondbEntity> {
    return CreateConnectiondbDtoToCreateConnectiondbEntityMapper.map(input);
  }

  static async map(input: CreateConnectiondbDto): Promise<CreateConnectiondbEntity> {
    return new CreateConnectiondbEntity({
      ...input,
    });
  }

  static async maps(inputs: CreateConnectiondbDto[]): Promise<CreateConnectiondbEntity[]> {
    return Promise.all(inputs.map((item) => CreateConnectiondbDtoToCreateConnectiondbEntityMapper.map(item)));
  }
}
