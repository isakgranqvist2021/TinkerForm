import { auth0 } from 'lib/auth0';
import Link from 'next/link';
import React from 'react';
import { TryAgainButton } from './buy-now-button';

export async function CheckoutSuccess() {
  const session = await auth0.getSession();

  return (
    <div className="flex flex-col gap-4 min-h-screen justify-center items-center text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-24 text-green-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
        />
      </svg>

      <h1 className="text-3xl font-bold">Subscription confirmed</h1>

      <p className="max-w-prose">
        Thank you for subscribing! You can now access your dashboard and manage
        your account.
      </p>

      <div className="flex gap-4 mt-4">
        {!session ? (
          <Link href="/auth/login" className="btn btn-primary">
            Login to access your account
          </Link>
        ) : (
          <React.Fragment>
            <Link href="/dashboard" className="btn btn-primary">
              Go to your dashboard
            </Link>
            <Link
              href="/dashboard/account/billing"
              className="btn btn-secondary"
            >
              Billing Settings
            </Link>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

interface CheckoutFailedProps {
  checkoutSessionId?: string;
}

export function CheckoutFailed(props: CheckoutFailedProps) {
  return (
    <div className="flex flex-col gap-4 min-h-screen justify-center items-center text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-24 text-red-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>

      <h1 className="text-3xl font-bold">Something went wrong</h1>

      <p className="max-w-prose">
        We're sorry, but there was an error processing your subscription.
      </p>

      <div className="flex gap-4 mt-4">
        {props.checkoutSessionId ? (
          <TryAgainButton
            checkoutSessionId={props.checkoutSessionId}
            className="btn btn-primary"
          >
            Try again
          </TryAgainButton>
        ) : (
          <Link href="/pricing" className="btn btn-primary">
            Choose a Plan
          </Link>
        )}
      </div>
    </div>
  );
}
