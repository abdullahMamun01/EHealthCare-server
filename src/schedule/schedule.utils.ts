import { addMinutes } from "date-fns";

    interface Schedule {
      startTime: Date;
      endTime: Date;
    }

    const generateSchedules = (
      startTime: Date,
      totalHours: number,
    ): Schedule[] => {

      return Array(totalHours * 2)
        .fill(null)
        .map((_, i) => {
          const startScheduleTime = addMinutes(startTime, i * 30);
          const endScheduleTime = addMinutes(startScheduleTime, 30);
          return { startTime: startScheduleTime, endTime: endScheduleTime };
        });
    };

    export default generateSchedules