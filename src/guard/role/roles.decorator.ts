import { SetMetadata } from '@nestjs/common';
export enum Role {
  Admin = 'ADMIN',
  User = 'PATIENT',
  Doctor = 'DOCTOR',
}

export const ROLE_KEY = 'role';

export const Roles = (...role: Role[]) => SetMetadata(ROLE_KEY, role);
