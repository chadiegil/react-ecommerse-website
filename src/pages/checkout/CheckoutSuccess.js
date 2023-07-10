import React from "react";
import { Link } from "react-router-dom";

const CheckoutSuccess = () => {
  return (
    <section style={{ marginTop: "100px" }}>
      <div className="container">
        <h2>CheckoutSuccessful</h2>
        <p>Thank you for your purchase</p>
        <br />
        <Link to="/order-history">
          <button className="--btn --btn-primary">View Order Status</button>
        </Link>
      </div>
    </section>
  );
};

export default CheckoutSuccess;
