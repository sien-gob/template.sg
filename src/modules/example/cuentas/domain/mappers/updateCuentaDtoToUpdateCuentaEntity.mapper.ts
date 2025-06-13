import { IMapper } from "src/app/modules/mappers/domain/models";
import { UpdateCuentaDto } from "../dtos";
import { UpdateCuentaEntity } from "../entities";

export class UpdateCuentaDtoToUpdateCuentaEntityMapper implements IMapper<UpdateCuentaDto, UpdateCuentaEntity> {
  private async map(input: UpdateCuentaDto): Promise<UpdateCuentaEntity> {
    return new UpdateCuentaEntity({
      nombre: input.nombre,
      descripcion: input.descripcion,
    });
  }

  async mapping(input: UpdateCuentaDto): Promise<UpdateCuentaEntity> {
    return await this.map(input);
  }
}
