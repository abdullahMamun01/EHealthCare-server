import { z } from "zod";

export const reviewSchema = z.object({
  appointmentId: z.string().min(1, "Appointment ID is required"),
  comment: z.string().min(1, "Comment is required"),
  rating: z.number().min(0, "Rating must be at least 0").max(5, "Rating cannot exceed 5").default(0.0),
});

export const updateReviewSchema = reviewSchema.partial();


export type ReviewDto = z.infer<typeof reviewSchema>;
export type UpdateReviewDto = z.infer<typeof updateReviewSchema>;