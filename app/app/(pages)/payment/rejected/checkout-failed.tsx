import { RetryCheckoutButton } from './retry-checkout-button';
import Link from 'next/link';

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
        We{"'"}re sorry, but there was an error processing your subscription.
      </p>

      <div className="flex gap-4 mt-4">
        {props.checkoutSessionId ? (
          <RetryCheckoutButton
            checkoutSessionId={props.checkoutSessionId}
            className="btn btn-primary"
          >
            Try again
          </RetryCheckoutButton>
        ) : (
          <Link href="/pricing" className="btn btn-primary">
            Choose a Plan
          </Link>
        )}
      </div>
    </div>
  );
}
