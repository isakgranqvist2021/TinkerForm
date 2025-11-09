import { BuyNowButton } from 'components/buy-now-button';
import { Package, packages } from 'config/packages';
import { formatCurrency } from 'utils';

export function PackageCards() {
  return (
    <div className="flex gap-2 lg:flex-row flex-col">
      {Object.values(packages).map((pkg) => (
        <PricingCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
}

interface PricingCardProps {
  pkg: Package;
}
function PricingCard(props: PricingCardProps) {
  return (
    <div className="card flex-grow bg-base-100 shadow-sm w-full">
      <div className="card-body flex flex-col justify-between">
        {props.pkg.badge && (
          <span className="badge badge-xs badge-warning">
            {props.pkg.badge}
          </span>
        )}

        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">{props.pkg.name}</h2>
          <span className="text-xl">
            {!props.pkg.price ? 'Free' : formatCurrency(props.pkg.price)}
          </span>
        </div>
        <ul className="mt-6 flex flex-col gap-2 text-xs">
          {props.pkg.features.map((feature, index) => {
            if (feature.available) {
              return (
                <li key={index}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4 me-2 inline-block text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{feature.name}</span>
                </li>
              );
            }

            return (
              <li className="opacity-50" key={index}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 me-2 inline-block text-base-content/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="line-through">{feature.name}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-6">
          <BuyNowButton id={props.pkg.id} className="btn btn-primary btn-block">
            Subscribe
          </BuyNowButton>
        </div>
      </div>
    </div>
  );
}
