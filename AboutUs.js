import React from 'react';
import Layout from './Layout';
import './AboutUs.css';

function AboutUs() {
  return (
    <Layout>
      <div className="about-us-container">
        <h1 className="about-us-title">About Us</h1>
        <p className="about-us-description">
          Welcome to our company's About Us page. We provide quality agricultural products and services to our customers.
        </p>
      </div>
    </Layout>
  );
}

export default AboutUs;
