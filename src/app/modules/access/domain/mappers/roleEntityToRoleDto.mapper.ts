import { IMapper } from "src/app/modules/mappers/domain/models";
import { RoleDto } from "../dtos";
import { RoleEntity } from "../entities";

export class RoleEntityToRoleDtoMapper implements IMapper<RoleEntity[], RoleDto[]> {
  private async map(input: RoleEntity): Promise<RoleDto> {
    return new RoleDto({
        id: input.id,
        name: input.name,
        options: input.options,
        permissions: input.permissions
    });
  }

  async mapping(input: RoleEntity[]): Promise<RoleDto[]> {
    return Promise.all(input.map((entity) => this.map(entity)));
  }

  static async mappings(input: RoleEntity[]): Promise<RoleDto[]> {
    const mapper = new RoleEntityToRoleDtoMapper();
    return mapper.mapping(input);
  }
}
