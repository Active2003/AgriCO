import React from 'react';
import Layout from './Layout';
import farmingVideo from './farmingVideo.mp4'; // Replace with your farming video file
import './Home.css'; // Import CSS file for styling

const Home = () => {
  const schemes = [
    {
      id: 1,
      title: 'Scheme 1',
      description: 'Description of Scheme 1...',
    },
    {
      id: 2,
      title: 'Scheme 2',
      description: 'Description of Scheme 2...',
    },
    {
      id: 3,
      title: 'Scheme 3',
      description: 'Description of Scheme 3...',
    },
    // Add more schemes as needed
  ];
  return (
    <Layout>
      <div className="video-background">
        <video autoPlay loop muted className="video-content">
          <source src={farmingVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="video-overlay">
          <h1>Welcome to Our Farming Website</h1>
          <p>Explore our wide range of farming products and schemes</p>
        </div>
      </div>

      <div className="schemes-description">
        {/* Description of schemes */}
        <section className="scheme-section">
      <div className="container">
        <h2 className="section-title">Our Schemes</h2>
        <div className="scheme-list">
          {schemes.map((scheme) => (
            <div className="scheme-card" key={scheme.id}>
              <h3 className="scheme-title">{scheme.title}</h3>
              <p className="scheme-description">{scheme.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
      </div>
    </Layout>
  );
};

export default Home;
