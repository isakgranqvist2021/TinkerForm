import { env } from 'config';
import { ContactFormModel } from 'models/contact-form';

export async function sendContactForm(dto: ContactFormModel): Promise<boolean> {
  try {
    const res = await fetch(`${env.API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });

    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
}
