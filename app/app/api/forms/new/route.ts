import { FormTable } from 'db/query/form';
import { SectionTable } from 'db/query/section';
import { getSession } from 'lib/auth0';
import { formSchema } from 'models/form';

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

    const res = await FormTable.insertOne(form, session.user.email);
    await SectionTable.insertMany(form, res[0].id);

    return new Response(JSON.stringify(res[0]), { status: 201 });
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
