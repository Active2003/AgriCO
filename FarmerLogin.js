import Layout from './Layout';
import React, { useContext } from 'react';
import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Make sure to provide the correct path to AuthContext
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import {
  MDBContainer,
  MDBTabs,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBCheckbox,
  MDBInput,
  MDBTabsItem // Import the MDBTabsItem component
} from 'mdb-react-ui-kit';

function FLogin() {
  const [showRSuccess, setshowRSuccess] = useState(false); // State for registration success message
  const [showRError, setshowRError] = useState(false); // State for registration success message
  const [showLSuccess, setShowLSuccess] = useState(false); // State to control error message visibility
  const [showLError, setShowLError] = useState(false); // State to control error message visibility
  const { isLoggedIn, login, updateUser, logout, user } = useContext(AuthContext); // Include 'logout' from context
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [justifyActive, setJustifyActive] = useState('tab1');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    mobile: '',
    document: null,
    address: '',
  });

  // Function to handle successful login and set user data

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleJustifyClick = (value) => {
    setJustifyActive(value);
    setStep(1); // Reset to the first step whenever tab changes
    setFormData({  // Reset form data
      name: '',
      username: '',
      email: '',
      password: '',
      mobile: '',
      document: null,
      address: '',
    });
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    const val = type === 'file' ? files[0] : value; // For file input, take the first file
    setFormData({ ...formData, [name]: val });
  };  

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };  

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5001/flogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        if (data && data.userData) {
          updateUser(data.userData); // Update user data upon successful login
          login(data.userData); // Call the login function to set user data
          setShowLSuccess(true); // Display error message
        // Hide error message after 3 seconds and then redirect
        setTimeout(() => {
          setShowLSuccess(false);
          navigate('/'); // Redirect to the desired page after timeout
        }, 3000);
        }
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.error);
        setShowLError(true); // Display error message
        // Hide error message after 3 seconds and then redirect
        setTimeout(() => {
          setShowLError(false);
          navigate('/FarmerLogin'); // Redirect to the desired page after timeout
        }, 3000);

      }
    }  catch (error) {
      console.error('Error occurred during login:', error);
      setShowLError(true); // Display error message for unexpected errors
      // Hide error message after 3 seconds and then redirect
      setTimeout(() => {
        setShowLError(false);
        navigate('/FarmerLogin'); // Redirect to the desired page after timeout
      }, 3000);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch('http://localhost:5001/FarmerLogin', {
        method: 'POST',
        body: formDataToSend, // Use FormData to send the multipart/form-data
      });

      if (response.ok) {
        console.log('Registration data submitted successfully!');
        setshowRSuccess(true); // Display registration success message
        setTimeout(() => {
          setshowRSuccess(false);
          navigate('/'); // Redirect to the desired page after timeout
        }, 3000);

        // Perform any necessary actions upon successful submission
      } else {
        console.error('Failed to submit registration data.');
        setshowRError(true); // Display registration success message
        setTimeout(() => {
          setshowRError(false);
          navigate('/FarmerLogin');

        }, 3000);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setshowRError(true); // Display registration success message
        setTimeout(() => {
          setshowRError(false);
          navigate('/FarmerLogin');
        }, 3000);
    }
  };
  return (
    <Layout>  
      <MDBContainer className="p-3 my-5 d-flex flex-column w-25 w-md-25">
        <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
          <MDBTabsItem>
            <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
              Login
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
              Register
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>

        <MDBTabsContent>
        <MDBTabsPane show={justifyActive === 'tab1'}>
            <form onSubmit={handleLoginSubmit}>
              <MDBInput wrapperClass='mb-4' label='Email address' id='login-form-email' type='email' name='email' value={loginData.email} onChange={handleLoginInputChange} />
              <MDBInput wrapperClass='mb-4' label='Password' id='login-form-password' type='password' name='password' value={loginData.password} onChange={handleLoginInputChange} />

              <div className="d-flex justify-content-between mx-4 mb-4">
                <MDBCheckbox name='rememberMe' value='true' id='login-form-rememberMe' label='Remember me' />
                <a href="!#">Forgot password?</a>
              </div>

              <MDBBtn type="submit" className="mb-4 w-100" style={{ height: '40px' }}>Sign in</MDBBtn>
              <p className="text-center">Not a member? <a href="#!">Register</a></p>
            </form>
          </MDBTabsPane>
        <MDBTabsPane show={justifyActive === 'tab2'}>
  {step === 1 && (
    <form onSubmit={handleNextStep}>
      {/* Registration fields for the first step */}
      <MDBInput
        wrapperClass='mb-4'
        label='Full Name'
        type='text'
        name='name'
        onChange={handleInputChange}
        value={formData.name}
      />
      <MDBInput
        wrapperClass='mb-4'
        label='Username'
        type='text'
        name='username'
        onChange={handleInputChange}
        value={formData.username}
      />
      <MDBInput
        wrapperClass='mb-4'
        label='Email'
        type='email'
        name='email'
        onChange={handleInputChange}
        value={formData.email}
      />
      <MDBInput
        wrapperClass='mb-4'
        label='Password'
        type='password'
        name='password'
        onChange={handleInputChange}
        value={formData.password}
      />
      <MDBBtn type="submit" className="mb-4 w-100" style={{ height: '40px' }}>Next</MDBBtn>
    </form>
  )}

  {step === 2 && (
    <form onSubmit={handleRegisterSubmit}>
      {/* Registration fields for the second step */}
      <MDBInput
        wrapperClass='mb-4'
        label='Mobile No'
        type='text'
        name='mobile'
        onChange={handleInputChange}
        value={formData.mobile}
      />
      <MDBInput
        wrapperClass='mb-4'
        label='Upload Document'
        type='file'
        name='document'
        onChange={handleInputChange}
        // Adjust value and onChange according to your requirement for file input
      />
      <MDBInput
        wrapperClass='mb-4'
        label='Address'
        type='text'
        name='address'
        onChange={handleInputChange}
        value={formData.address}
      />
      <MDBBtn type="button" onClick={handlePreviousStep} className="mb-4 w-100" style={{ height: '40px' }}>Previous</MDBBtn>
      <MDBBtn type="submit" className="mb-4 w-100" style={{ height: '40px' }}>Register</MDBBtn>
    </form>
  )}
    </MDBTabsPane>
  </MDBTabsContent>
</MDBContainer>

      <Modal show={showLError} onHide={() => setShowLError(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>Login failed. Please try again.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLError(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showLSuccess} onHide={() => setShowLSuccess(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Login Successful. Navigating to Home Page...</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLSuccess(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Registration success modal */}
      <Modal show={showRSuccess} onHide={() => setshowRSuccess(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your registration was successful.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setshowRSuccess(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRError} onHide={() => setshowRError(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Failed.</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your registration Failed. Please try again.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setshowRError(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default FLogin;