import React, { useState } from 'react';
import { MDBFooter, MDBContainer } from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faGoogle, faInstagram, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  const [activeButtons, setActiveButtons] = useState({
    facebook: false,
    twitter: false,
    google: false,
    instagram: false,
    linkedin: false,
    github: false,
  });

  const handleButtonClick = (iconName) => {
    setActiveButtons((prevActiveButtons) => ({
      ...prevActiveButtons,
      [iconName]: !prevActiveButtons[iconName],
    }));
  };

  return (
    <MDBFooter className='bg-dark text-center text-white'>
      <MDBContainer className='p-4 pb-0 d-flex justify-content-center align-items-center flex-wrap'>
        <section className='mb-4'>
        <a href='https://www.facebook.com/' target='_blank' rel='noopener noreferrer'>
            <button
              className={`btn btn-light ${activeButtons.facebook ? 'active' : ''}`}
              onClick={() => handleButtonClick('facebook')}
            >
              <FontAwesomeIcon icon={faFacebook} />
            </button>
          </a>
          <a href='https://twitter.com/' target='_blank' rel='noopener noreferrer'>
            <button
              className={`btn btn-light ${activeButtons.twitter ? 'active' : ''}`}
              onClick={() => handleButtonClick('twitter')}
            >
              <FontAwesomeIcon icon={faTwitter} />
            </button>
          </a>
          <a href='https://google.com/' target='_blank' rel='noopener noreferrer'>
            <button
              className={`btn btn-light ${activeButtons.google ? 'active' : ''}`}
              onClick={() => handleButtonClick('google')}
            >
              <FontAwesomeIcon icon={faGoogle} />
            </button>
          </a>
          <a href='https://instagram.com/' target='_blank' rel='noopener noreferrer'>
            <button
              className={`btn btn-light ${activeButtons.instagram ? 'active' : ''}`}
              onClick={() => handleButtonClick('instagram')}
            >
              <FontAwesomeIcon icon={faInstagram} />
            </button>
          </a>
          <a href='https://linkedin.com/' target='_blank' rel='noopener noreferrer'>
            <button
              className={`btn btn-light ${activeButtons.instagram ? 'active' : ''}`}
              onClick={() => handleButtonClick('linkedin')}
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </button>
          </a>
          <a href='https://github.com/' target='_blank' rel='noopener noreferrer'>
            <button
              className={`btn btn-light ${activeButtons.github ? 'active' : ''}`}
              onClick={() => handleButtonClick('github')}
            >
              <FontAwesomeIcon icon={faGithub} />
            </button>
          </a>
        </section>
      </MDBContainer>

      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2023 Copyright:
        <a className='text-white' href='https://mdbootstrap.com/'>
          AgriCO
        </a>
      </div>
    </MDBFooter>
  );
}

export default Footer;
