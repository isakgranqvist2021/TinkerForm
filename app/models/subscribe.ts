import { packages } from 'config/packages';
import z from 'zod';

export const createSubscriptionSchema = z.object({
  id: z.literal(packages.map((pkg) => pkg.id)),
});
