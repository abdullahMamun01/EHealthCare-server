import { z } from 'zod';
import { $Enums } from '@prisma/client';
enum BloodGroup {
  A_POS = 'A+',
  A_NEG = 'A-',
  B_POS = 'B+',
  B_NEG = 'B-',
  AB_POS = 'AB+',
  AB_NEG = 'AB-',
  O_POS = 'O+',
  O_NEG = 'O-',
}
enum MetarialStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
}

const patientHealthDataSchema = z.object({
  bloodGroup: z.nativeEnum($Enums.BloodGroup).optional(),
  hasDibatics: z.boolean(),
  hasAlergies: z.boolean(),
  bloodPressure: z.string(),
  hasPastSurgeries: z.string(),
  height: z.number().min(0),
  weight: z.number().min(0),
  maritalStatus: z.nativeEnum(MetarialStatus),
  medications: z.array(z.string()),
});

const medicleReportsSchema = z.object({
  reportName: z.string().min(1, 'Report name is required'),
  reportLink: z.string().url('Invalid URL format').optional(),
});

const patientUpdateSchema = z
  .object({
    patientHealthData: patientHealthDataSchema.optional(),
    medicleReports: medicleReportsSchema.optional(),
  })
  .refine(
    (data) =>
      data.patientHealthData !== undefined || data.medicleReports !== undefined,
    {
      message:
        'At least one field (patientHealthData or medicleReports) is required',
      path: [],
    },
  );

export type PatientHealthDataDto = z.infer<typeof patientHealthDataSchema>;
export type MedicleReportsDto = z.infer<typeof medicleReportsSchema>;
export type PatientUpdateDto = z.infer<typeof patientUpdateSchema>;
export { patientHealthDataSchema, medicleReportsSchema, patientUpdateSchema };
