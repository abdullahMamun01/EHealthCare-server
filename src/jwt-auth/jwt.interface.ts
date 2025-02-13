/* eslint-disable prettier/prettier */
export interface JwtPayload {
  id: string;
  patient_id?: string;
  doctor_id?: string;
  admin_id?: string;
  name: string;
  email: string;
  role?: string;
}
