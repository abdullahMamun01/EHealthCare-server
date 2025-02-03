import { type } from "node:os";
import { doctorSchema } from "src/doctor/dto/update-doctor.dto";
import { z } from "zod";


const updateDoctorSchema = doctorSchema.partial();

export type doctorUpdateDto = z.infer<typeof updateDoctorSchema>
