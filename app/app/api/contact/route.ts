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
      throw new Error('Failed to send contact form');
    }

    return ok();
  } catch (err) {
    console.error(err);
    return internalServerError();
  }
}
