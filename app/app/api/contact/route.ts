import { contactFormSchema } from 'models/contact-form';
import { sendContactForm } from 'services/api/contact';
import { internalServerError, ok } from '../utils';

export async function POST(
  req: Request,
  ctx: RouteContext<'/api/subscription'>,
) {
  try {
    const data = await req.json();
    const parsedData = contactFormSchema.parse(data);

    const result = await sendContactForm(parsedData);
    if (!result) {
      return internalServerError();
    }

    return ok();
  } catch (err) {
    return internalServerError();
  }
}
