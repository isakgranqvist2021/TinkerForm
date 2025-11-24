import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content p-10">
      <div className="footer sm:footer-horizontal max-w-7xl mx-auto">
        <nav>
          <h6 className="footer-title">Product</h6>
          <Link href="/product" className="link link-hover">
            Product
          </Link>
          <Link href="/pricing" className="link link-hover">
            Pricing
          </Link>
          <Link href="/features" className="link link-hover">
            Features
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <Link href="/about" className="link link-hover">
            About us
          </Link>
          <Link href="/contact" className="link link-hover">
            Contact
          </Link>
          <Link href="/support" className="link link-hover">
            Support
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title">Social</h6>
          <div className="grid grid-flow-col gap-4">
            <a href="https://www.linkedin.com/company/tinkerformapp">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zm7.98 0h3.83v2.16h.05c.53-1 1.84-2.16 3.79-2.16 4.05 0 4.8 2.67 4.8 6.15V24h-4v-8.13c0-1.94-.04-4.44-2.71-4.44-2.71 0-3.12 2.12-3.12 4.3V24h-4V8z" />
              </svg>
            </a>
          </div>
        </nav>
      </div>
    </footer>
  );
}
