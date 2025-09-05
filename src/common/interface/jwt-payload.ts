import { UserRole } from "../enums/user-role.enum";

export interface JwtPayload {
  sub: string;       // ID del usuario
  email?: string;    // útil para trazabilidad
  role?: UserRole;     // si manejas roles o permisos
}
