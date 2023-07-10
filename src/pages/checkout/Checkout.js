import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY,
  selectCartItems,
  selectCartTotalAmount,
} from "../../redux/slice/cartSlice";
import { selectEmail } from "../../redux/slice/authSlice";
import {
  selectBillingAddress,
  selectShippingAddress,
} from "../../redux/slice/checkoutSlice";
import { toast } from "react-toastify";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";

const Checkout = () => {
  const [message, setMessage] = useState("initializing checkout");

  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);

  const [clientSecret, setClientSecret] = useState("");

  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotalAmount);
  const customerEmail = useSelector(selectEmail);
  const billingAddress = useSelector(selectBillingAddress);
  const shippingAddress = useSelector(selectShippingAddress);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL);
    dispatch(CALCULATE_TOTAL_QUANTITY);
  }, [dispatch, cartItems]);

  const description = `Bazak foopark payment: email: ${customerEmail}, amount: ${totalAmount}`;

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads

    // http://localhost:4242/create-payment-intent
    // https://bazak-food-park.herokuapp.com
    fetch(
      "https://bazak-food-park.herokuapp.com/create-payment-intent/create-payment-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          userEmail: customerEmail,
          shipping: shippingAddress,
          billing: billingAddress,
          description,
        }),
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((json) => Promise.reject(json));
        }
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        setMessage("Failed to initialized checkout");
        toast.error("Something went wrong!");
      });
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      <section>
        <div className="container">{!clientSecret && <h3>{message}</h3>}</div>
      </section>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
};

export default Checkout;
