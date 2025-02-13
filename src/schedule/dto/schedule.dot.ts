import { z } from 'zod';

// Regex for validating date in the format YYYY-MM-DD
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
// Regex for validating time in the format HH:MM
const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

const currentDate = new Date();
currentDate.setSeconds(0, 0);
currentDate.setHours(0, 0, 0, 0);
const dateValidator = z
  .string()
  .regex(dateRegex, { message: 'Invalid date format, must be YYYY-MM-DD' })
  .refine(
    (date) => {
      const parsedDate = new Date(date);
      return parsedDate >= currentDate;
    },
    {
      message: 'Date must be present or in the future',
    },
  );

const timeValidator = z
  .string()
  .regex(timeRegex, { message: 'Invalid time format, must be HH:MM' })
  .refine(
    (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      now.setSeconds(0, 0);

      const parsedTime = new Date(now.setHours(hours, minutes));
      return parsedTime >= currentDate;
    },
    {
      message: 'Time must be present or in the future',
    },
  );

const scheduleSchema = z.object({
  startDate: dateValidator,
  endDate: dateValidator,
  startTime: timeValidator,
  endTime: timeValidator,
});

export type ScheduleDto = z.infer<typeof scheduleSchema>;

export { scheduleSchema };
