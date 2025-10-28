const env = {
  NODE_ENV: process.env.NODE_ENV as string,

  MONGO_DB_DATABASE_URL: process.env.MONGO_DB_DATABASE_URL as string,

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
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
