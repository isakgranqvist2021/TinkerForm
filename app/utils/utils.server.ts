import { updateThemeSchema } from 'models/theme';
import { cookies } from 'next/headers';

export async function getThemeFromCookie() {
  const cookieStore = await cookies();
  const schemaParseResult = updateThemeSchema.safeParse({
    theme: cookieStore.get('theme')?.value,
  });

  return schemaParseResult.data?.theme ?? 'light';
}
