import useMutation from 'swr/mutation';

export function useAcceptCookies() {
  return useMutation('/api/cookies', async (url) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res.ok;
  });
}
