import { IMapper } from "src/app/modules/mappers/domain/models";
import { CreateCuentaDto } from "../dtos";
import { CreateCuentaEntity } from "../entities";

export class CreateCuentaDtoToCreateCuentaEntityMapper implements IMapper<CreateCuentaDto, CreateCuentaEntity> {
  private async map(input: CreateCuentaDto): Promise<CreateCuentaEntity> {
    return new CreateCuentaEntity({
      id: input.id,
      codigo: input.codigo,
      nombre: input.nombre,
      descripcion: input.descripcion
    });
  }

  async mapping(input: CreateCuentaDto): Promise<CreateCuentaEntity> {
    return await this.map(input);
  }

}
