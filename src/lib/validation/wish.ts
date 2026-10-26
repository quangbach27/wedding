import { z } from "zod";

export const wishSchema = z.object({
  name: z.string(),
  message: z.string(),
});
