import { PackageId, packages } from 'config/packages';
import z from 'zod';

export const createSubscriptionSchema = z.object({
  id: z.literal(Object.keys(packages) as PackageId[]),
});
