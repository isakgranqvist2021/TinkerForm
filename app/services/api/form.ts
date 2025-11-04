import { auth0 } from 'lib/auth0';

export interface FormDto {
  email: string;
  title: string;
  description: string;
  location: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  responseCount: number;
}

export async function getForms(): Promise<FormDto[]> {
  const token = await auth0.getAccessToken();

  try {
    const res = await fetch(`${process.env.API_URL}/form`, {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch forms');
    }

    const data = await res.json();

    return data as FormDto[];
  } catch (error) {
    return [];
  }
}
