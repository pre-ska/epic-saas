import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { SITE_URL } from "src/core/utils";

export default function Plans({ plans }) {
  const [selected, setSelected] = useState("month");

  const plan = plans.find((plan) => plan.interval === selected);

  function togglePlan() {
    selected === "month" ? setSelected("year") : setSelected("month");
  }
  console.log(plans);
  async function onCheckout() {
    //! ovo ide na api endpoint koji će kreirati checkout session na stripe-u
    const response = await fetch(`${SITE_URL}/api/checkout/${plan.id}`);

    //! natrag dobijem session id od stripe-a
    const data = await response.json();

    //! kreiram stripe objekt
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

    //! redirektam usera na stripe session koji je pripremljen za njega , sa cijenom itd...
    await stripe.redirectToCheckout({ sessionId: data.id });
  }

  return (
    <div className="bg-salmon border-right">
      <div className="column-padding centered">
        <div className="callout-wrap">
          <div className="plan">
            <div className="plan-wrap">
              <div className="plan-content">
                <div className="plan-switch">
                  Monthly
                  <label className="switch">
                    <input type="checkbox" onChange={togglePlan} />
                    <span className="slider"></span>
                  </label>
                  Yearly
                </div>

                <h2 className="plan-name">{plan.name}</h2>

                <div>
                  Just €{plan.price} / {plan.interval}
                </div>

                <div>
                  <button onClick={onCheckout} className="large-button">
                    <div className="large-button-text">Buy Now</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
