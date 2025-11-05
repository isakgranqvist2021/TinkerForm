export function requireEnv(variableName: string): string {
  const value = process.env[variableName];

  if (!value) {
    throw new Error(`Missing env variable: ${variableName}`);
  }

  return value;
}

const env = {
  NODE_ENV: requireEnv('NODE_ENV'),
  STRIPE_SECRET_KEY: requireEnv('STRIPE_SECRET_KEY'),
  DATABASE_URL: requireEnv('DATABASE_URL'),
  BLOB_READ_WRITE_TOKEN: requireEnv('BLOB_READ_WRITE_TOKEN'),
  API_URL: requireEnv('API_URL'),
};

const errors = [];

for (const k in env) {
  if (!env[k as keyof typeof env]) {
    errors.push(`Missing env variable: ${k}\n`);
  }
}

if (errors.length) {
  throw new Error('\n' + errors.join(''));
}

export { env };
