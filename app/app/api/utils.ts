export function unauthorized(message = 'Unauthorized') {
  return new Response(JSON.stringify({ statusCode: 401, message }), {
    status: 401,
  });
}

export function forbidden(message = 'Forbidden') {
  return new Response(JSON.stringify({ statusCode: 403, message }), {
    status: 403,
  });
}

export function notFound(message = 'Not Found') {
  return new Response(JSON.stringify({ statusCode: 404, message }), {
    status: 404,
  });
}

export function badRequest(message = 'Bad Request') {
  return new Response(JSON.stringify({ statusCode: 400, message }), {
    status: 400,
  });
}

export function internalServerError(message = 'Internal Server Error') {
  return new Response(
    JSON.stringify({
      statusCode: 500,
      message,
    }),
    { status: 500 },
  );
}

export function ok(data: Record<string, unknown> = {}) {
  return new Response(JSON.stringify(data), { status: 200 });
}

export function created(data: Record<string, any> = {}) {
  return new Response(JSON.stringify(data), { status: 201 });
}
