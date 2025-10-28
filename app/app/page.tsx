import { BuyNowButton } from 'components/buy-now-button';
import { products } from 'data/products';
import React from 'react';
import { formatCurrency } from 'utils';

export const metadata = {
  title: 'Home',
};

export default function Home() {
  return (
    <section className="container mx-auto px-2 py-8">
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
        {products.map((product) => (
          <div className="card bg-base-100 shadow-xl" key={product.id}>
            <figure>
              <img src={product.image} alt={product.name} />
            </figure>
            <div className="card-body">
              <span>{formatCurrency(product.price)}</span>
              <h2 className="card-title">{product.name}</h2>
              <p>{product.description}</p>
              <div className="card-actions justify-end">
                <BuyNowButton cartItem={{ id: product.id, quantity: 1 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
