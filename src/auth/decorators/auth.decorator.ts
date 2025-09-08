import { applyDecorators, UseGuards } from "@nestjs/common";

import { AuthGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "./roles.decorator";
import { UserRole } from "../../common/enums/user-role.enum";

export function Auth(role: UserRole){

    return applyDecorators(Roles(role), UseGuards(AuthGuard, RolesGuard))

    


}