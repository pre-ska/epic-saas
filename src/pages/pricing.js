import Benefits from "src/pricing/components/Benefits";
import Plans from "src/pricing/components/Plans";
import { stripe } from "src/pricing/utils/stripe";

export default function PricingPage({ plans }) {
  return (
    <div className="grid-halves h-screen-navbar">
      <Plans plans={plans} />
      <Benefits />
    </div>
  );
}

export async function getStaticProps() {
  const { data: prices } = await stripe.prices.list();

  const plans = [];

  //! ovo je product od Stripe-a ... npr. napravio sam Pro Plan sa dvije cijene monthly, yearly
  //! ovo mi treba jer u predhodnoj metodi ne dobijem ime samog producta...sve ostalo dobijem
  //! znači trebam loopat po prices, i za svaki price dohatim product,
  //! kreiram novi OBJ sa svim potrebnim podacima, pusham u PLANS array i to pošaljem kao propse

  for (const price of prices) {
    const product = await stripe.products.retrieve(price.product);
    plans.push({
      name: product.name,
      id: price.id,
      price: price.unit_amount / 100,
      interval: price.recurring.interval,
    });
  }

  return {
    props: {
      plans,
    },
  };
}
