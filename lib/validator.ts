import * as z from "zod"

export const eventFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string()
    .nullable() // Allow `null` as a value
    .transform((value) => value ?? undefined) // Convert `null` to `undefined`
    ,
  location: z.string()
    .nullable() // Allow `null` as a value
    .transform((value) => value ?? undefined) // Convert `null` to `undefined`
    ,
  imageUrl: z.string().nullable().transform((value) => value ?? undefined), // Handle null
  startDateTime: z.date(),
  endDateTime: z.date(),
  categoryId: z.string(),
  price: z.string(),
  isFree: z.boolean(),
  url: z.string().url(),
});

