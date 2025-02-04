import { z } from 'zod';
export enum DoctorSpecialty {
  GENERAL_PHYSICIAN = 'General Physician',
  CARDIOLOGY = 'Cardiology',
  NEUROLOGY = 'Neurology',
  ORTHOPEDICS = 'Orthopedics',
  DERMATOLOGY = 'Dermatology',
  PEDIATRICS = 'Pediatrics',
  GYNECOLOGY = 'Gynecology',
  PSYCHIATRY = 'Psychiatry',
  ENT = 'Ear, Nose, and Throat (ENT)',
  OPHTHALMOLOGY = 'Ophthalmology',
  GASTROENTEROLOGY = 'Gastroenterology',
  UROLOGY = 'Urology',
  PULMONOLOGY = 'Pulmonology',
  NEPHROLOGY = 'Nephrology',
  ENDOCRINOLOGY = 'Endocrinology',
  ONCOLOGY = 'Oncology',
  RHEUMATOLOGY = 'Rheumatology',
  HEMATOLOGY = 'Hematology',
  INFECTIOUS_DISEASES = 'Infectious Diseases',
  SEXOLOGY = 'Sexology',
  PSYCHOTHERAPY = 'Psychotherapy',
  HOMEOPATHY = 'Homeopathy',
  AYURVEDA = 'Ayurveda',
}



const specialitySchema = z.object({

    name: z.nativeEnum(DoctorSpecialty, {
      errorMap: () => ({ message: `Invalid specialty, please enter one of ${Object.values(DoctorSpecialty).join(', ')}` }),
    }),
  icon: z.string().min(1, 'Icon is required').optional(),
});

export type SpecialitesDto = z.infer<typeof specialitySchema>;

export  { specialitySchema };
