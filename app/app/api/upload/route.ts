import { put } from '@vercel/blob';

export async function POST(req: Request, ctx: RouteContext<'/api/upload'>) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return new Response(
        JSON.stringify({
          statusCode: 400,
          message: 'Invalid file',
        }),
        { status: 400 },
      );
    }

    const { url } = await put(`files/${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return Response.json({ url });
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({
        statusCode: 500,
        message: err instanceof Error ? err.message : 'Internal server error',
      }),
      { status: 500 },
    );
  }
}
