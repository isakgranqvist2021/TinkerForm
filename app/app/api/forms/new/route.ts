import { getSession } from 'lib/auth0';
import { formSchema } from 'models/form';
import { db } from 'db/db';
import { formTable, sectionTable } from 'db/schema';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session.user.email) {
      return new Response(
        JSON.stringify({
          statusCode: 401,
          message: 'Unauthorized',
        }),
        { status: 401 },
      );
    }

    const body = await req.json();
    const form = formSchema.parse(body);

    const res = await db
      .insert(formTable)
      .values({
        email: session.user.email,
        title: form.title,
        description: form.description,
      })
      .returning()
      .execute();

    await db
      .insert(sectionTable)
      .values(
        form.sections.map((section) => ({
          fk_form_id: res[0].id,
          type: section.type,
          title: section.title,
          index: section.index,
          description: section.description,
          required: section.required,
          min_length: Number(section.minLength || 0),
          max_length: Number(section.maxLength || 0),
        })),
      )
      .execute();

    return new Response('', { status: 201 });
  } catch (err) {
    console.log(err);

    return new Response(
      JSON.stringify({
        statusCode: 500,
        message: err instanceof Error ? err.message : 'Internal server error',
      }),
      { status: 500 },
    );
  }
}
