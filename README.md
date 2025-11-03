
# Job App

An application where you can publish a job and recieve applications.
You can view stats like number of applications, completion rate, average completion time.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file. 

Create a .env file in the app directory and add these variables.

See app/.env.template

`NODE_ENV`

`AUTH0_SECRET`

`APP_BASE_URL`

`AUTH0_DOMAIN`

`AUTH0_CLIENT_ID`

`AUTH0_CLIENT_SECRET`

`AUTH0_SCOPE`

`STRIPE_SECRET_KEY`

`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

`DATABASE_URL`

`BLOB_READ_WRITE_TOKEN`
## Installation

Install JobApp with npm

```bash
  cd app
  npm install
```
    
## Running Tests

To run tests, run the following command

```bash
  cd app
  npm run test
```


## Tech Stack

**Tech:** React (Next.js), Vercel, Auth0, Stripe, Drizzle (PSQL), Neon (Serverless PSQL)

**Styling:** TailwindCSS (DaisyUI)

