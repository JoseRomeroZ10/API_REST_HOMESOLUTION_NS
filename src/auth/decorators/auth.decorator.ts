import { applyDecorators, UseGuards } from "@nestjs/common";
import { UserRole } from "../../common/enums/user-role.enum";
import { RolesGuard } from "../guards/roles.guard";
import { AuthGuard } from "../guards/auth.guard";
import { Roles } from "./roles.decorator";

export function Auth(role: UserRole){

    return applyDecorators(Roles(role), UseGuards(AuthGuard, RolesGuard))

    


}