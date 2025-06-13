import { RoleEntity } from "../../entities";

export interface IGetUserRolesRepository {
    getRolesById(userId:string) : Promise<RoleEntity[]>
}