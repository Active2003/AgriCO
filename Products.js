import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import Layout from './Layout';
import './Products.css'; // Assuming the styles are in a separate CSS file called Products.css
import { Modal, Button } from 'react-bootstrap';
import { AuthContext } from './AuthContext'; // Make sure to import your AuthContext here

import socketIOClient from 'socket.io-client';

const Products = () => {
  const [page, setPage] = useState(1); // State to manage form pages
  const [userRole, setUserRole] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const authContext = useContext(AuthContext);
  const [products, setProducts] = useState([]); // State to hold fetched products
  const [isFormOpen,  setIsFormOpen] = useState(false); // State to control the form display
  const [showRError, setshowRError] = useState(false);
  const [showRSuccess, setshowRSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [displayProducts, setDisplayProducts] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [bids, setBids] = useState({});
  const [inputBid, setInputBid] = useState(0); // State to hold input bid value
  const [productInfo, setProductInfo] = useState({ productId: null, productName: '' });
  const [showBiddingZone, setShowBiddingZone] = useState(false);
  const [user, setUser] = useState({}); // Assuming user data is available
  const [highestBids, setHighestBids] = useState({}); // State to hold highest bids for products


  useEffect(() => {
    if (socket) {
      products.forEach((product) => {
        socket.on(`bidUpdate_${product.productid}`, (updatedBid) => {
          const { productId, allBids, highestBid } = updatedBid;
  
          // Process allBids to get the highest bid
          let maxBid = 0;
          allBids.forEach((bid) => {
            if (bid.currentbid > maxBid) {
              maxBid = bid.currentbid;
            }
          });
  
          setHighestBids((prevHighestBids) => ({
            ...prevHighestBids,
            [productId]: highestBid || maxBid,
          }));
        });
        socket.emit('getBids', { productId: product.productid });
      });
    }
  }, [socket, products]);
  

  useEffect(() => {
    // Initialize Socket.IO client when userRole is 'buyer' and isApproved is true
    if (userRole === 'buyer' && isApproved) {
      const socket = socketIOClient('http://localhost:5001'); // Replace with the correct server URL and port
      setSocket(socket);

      // Listen for 'bidUpdate' event from the server
      socket.on('bidUpdate', (updatedBids) => {
        // Update bids on each bid event
        setBids(updatedBids);
        console.log('Received updated bids:', updatedBids); // Log the updated bids

      });
    }
  }, [userRole, isApproved]);

  
   

  const handleBidClick = (productId, productName) => {
    if (socket) {
      socket.emit('getBids', { productId });
      setProductInfo({ productId, productName });
      setShowBiddingZone(true);
    }
  };

  const handlePlaceBid = () => {
    const { user } = authContext;
    if (socket) {
      console.log('Product ID:', productInfo.productId);
      console.log('Input Bid:', inputBid);
      console.log('User ID:', user.buyerid);

      socket.emit('placeBid', { 
        productId: productInfo.productId, 
        bid: inputBid,
        userId: user.buyerid // Sending the user ID along with the bid data
      });
      setInputBid(0);
    }
  };

  useEffect(() => {
    // Fetch available products for bidding
    const fetchAvailableProductsForBidding = async () => {
      try {
        const response = await axios.get('http://localhost:5001/products/active'); // Replace with your backend endpoint
        if (response.status === 200) {
          setProducts(response.data);
        } else {
          console.error('Error fetching products for bidding:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching products for bidding:', error.message);
      }
    };

    if (userRole === 'buyer' && isApproved) {
      fetchAvailableProductsForBidding();
    }
  }, [userRole, isApproved]);

  useEffect(() => {
    handleViewProducts(); // Fetch products when the component mounts
  }, []); // Empty dependency array ensures it only runs once on mount
  

  // Function to toggle the visibility of products based on click count
  const toggleProductsVisibility = () => {
    // Increase the click count on each click
    setClickCount((prevCount) => prevCount + 1);
    
    if (clickCount === 1) {
      // Hide the products on double-click
      setDisplayProducts(false);
      // Reset the click count after a timeout
      setTimeout(() => {
        setClickCount(0);
      }, 300);
    }
  };

  useEffect(() => {
    // Toggle the display of products based on click count
    if (clickCount === 1) {
      setDisplayProducts(true);
    }
  }, [clickCount]);



  const [formData, setFormData] = useState({
    productname: '',
    productdesc: '',
    quantity: '',
    category: '',
    location: '',
    startingBid: '',
    regularBid: '',
    dueDate: '',
    productimage: null,
  });

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
  
    // If file input, update image in the form data
    if (type === 'file') {
      const file = event.target.files[0];
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: file,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };
  

const handleViewProducts = async () => {
  try {
    const { user } = authContext;
    // Assuming you have the logged-in farmer's ID stored in a variable like 'farmerId'
    const farmerId = user.farmerid; // Replace with your farmer's ID or fetch it from the logged-in user data

    if (farmerId) {
      const response = await axios.get(`http://localhost:5001/getFarmerProducts/${farmerId}`);

      if (response.status === 200) {
        setProducts(response.data);
      } else {
        console.error('Error fetching products:', response.statusText);
        // Handle other status codes if needed
      }
    } else {
      console.error('Invalid farmerId');
      // Handle invalid farmerId case
    }
  } catch (error) {
    console.error('Error fetching products:', error.message);
    // Handle Axios-specific errors or other exceptions
  }
};


  const handleNext = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevious = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const { user } = authContext;
    // Create FormData object and append form data
    const formDataToSend = new FormData();
    formDataToSend.append('farmerid', user.farmerid);
    formDataToSend.append('productname', formData.productname || '');
    formDataToSend.append('productdesc', formData.productdesc || '');
    formDataToSend.append('categoryid', formData.category || '');
    formDataToSend.append('quantity', formData.quantity || '');
    formDataToSend.append('location', formData.location || '');
    formDataToSend.append('startingbid', formData.startingBid || '');
    formDataToSend.append('regularbid', formData.regularBid || '');
    formDataToSend.append('dateposted', new Date().toISOString().slice(0, 19).replace('T', ' '));
    formDataToSend.append('duedate', formData.dueDate || '');
    formDataToSend.append('productimage', formData.productimage || '');
  
    // Display the form data in the console to check values before sending
    for (var pair of formDataToSend.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  
    try {
      const response = await fetch('http://localhost:5001/ProductSubmit', {
        method: 'POST',
        body: formDataToSend,
      });
  
      if (response.ok) {
        console.log('Success submit product data');
        setIsFormOpen(false);
        setshowRSuccess(true); // Display success modal after successful form submission
  
        // Clear form data after successful submission
        setFormData({
          productname: '',
          productdesc: '',
          quantity: '',
          category: '',
          location: '',
          startingBid: '',
          regularBid: '',
          dueDate: '',
          productimage: null,
        });
  
        // Close the success modal after 3 seconds
        setTimeout(() => {
          setshowRSuccess(false);
        }, 3000);
      } else {
        console.error('Failed to submit product data');
        setshowRError(true); // Display error modal upon failure
      }
    } catch (error) {
      console.error('Error submitting product data:', error);
      // Handle any network or other errors here
    }
  };
  

  const handleCloseForm = () => {
    setIsFormOpen(false); // Close the form on close button click
  };


  const handleAddProduct = () => {
    // Toggle form visibility on double-clicking the "Add Product" button
    setIsFormOpen((prevValue) => !prevValue);
  };
  
  useEffect(() => {
    // Retrieve user information from the context
    const { user } = authContext;

    // Check user role and approval status based on the received user data
    if (user && user.status) {
      if (user.status === 'FYes' || user.status === 'FNo') {
        setUserRole('farmer');
        setIsApproved(user.status === 'FYes');
      } else if (user.status === 'BYes' || user.status === 'BNo') {
        setUserRole('buyer');
        setIsApproved(user.status === 'BYes');
      } else {
        setUserRole('unknown');
        setIsApproved(false);
      }
    }
  }, [authContext]);

  return (
    <Layout>
      <div className="products-container">
      {userRole === 'farmer' && isApproved && (
        <div className="product-section">
          <h2>Your Products</h2>
          <div className="product-buttons">
          <div className="button-box">
            <button className="view-products-btn" onClick={toggleProductsVisibility}>
              Your Products
            </button>
            <p className="button-description">Description for viewing products...</p>
          </div>
            <div className="button-box">
              <button className="add-product-btn" onClick={handleAddProduct}>Add Product</button>
              <p className="button-description">Description for adding products...</p>
            </div>
          </div>
          {/* Display fetched products */}
          {products.length > 0 && displayProducts &&  (
      <div className="product-list">
        <h3>Your Products</h3>
        <section style={{ backgroundColor: '#eee' }}>
      <div className="container py-5">
      
      {products.map((product, index) => {
  // Construct the complete image path including the 'Server/' prefix and product image
  const imagePath = `${product.productimage}`;

  // Log the complete image path to the console
  console.log("Complete Image Path:", imagePath);

  return (
    <div key={index} className="row justify-content-center mb-3">
      <div className="col-md-12 col-xl-10">
        <div className="card shadow-0 border rounded-3">
          <div className="card-body">
            <div className="row">
              <div className="col-md-12 col-lg-3 col-xl-3 mb-4 mb-lg-0">
                <div className="bg-image hover-zoom ripple rounded ripple-surface">        
                  <img
                    src={imagePath} // Use the constructed imagePath here
                    className="w-100"
                    alt={imagePath}
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-xl-6">
                <h5>{product.productname}</h5>
                <p>Product Description: {product.productdesc}</p>
                <p>Starting Bid: {product.startingbid}</p>
                {/* Add other necessary details here */}
              </div>
              <div className="col-md-6 col-lg-3 col-xl-3 border-sm-start-none border-start">
                {/* Pricing and buttons related to the product */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})}

      </div>
    </section>
      </div>
    )}

        </div>
      )}
      {userRole === 'farmer' && !isApproved && (
        <div className="not-approved-farmer-section">
          <h2>Not Approved Farmer</h2>
          <p>You are not an approved farmer. Please get approval from the admin.</p>
        </div>
      )}
      {userRole === 'buyer' && isApproved && (
        <div>
          <h2>Products Available for Bid</h2>
          <ul>
            {products.map((product) => (
              <li key={product.productid}>
              <p>{product.productname} - Current Bid: Rs: {highestBids[product.productid] || product.regularbid}</p>
                <button onClick={() => handleBidClick(product.productid, product.productname)}>Bid</button>
              </li>
            ))}
          </ul>
        </div>
      )}
        {userRole === 'buyer' && !isApproved && (
          <div className="not-approved-farmer-section">
            <h2>Not Approved Buyer</h2>
            <p>You are not an approved buyer. Please get approval from the admin.</p>
          </div>
        )}
        {userRole === 'unknown' && (
          <div>
            <h2>Unknown Role</h2>
            <p>Could not determine your role. Please contact support.</p>
          </div>
        )}

        {/* Button to view user details */}
        <button onClick={() => setShowModal(true)}>View User Details</button>

        {/* Modal component */}
        {showModal && (
          <Modal
            closeModal={() => setShowModal(false)}
            user={authContext.user}
          />
        )}
        {/* Add product form */}
        {isFormOpen && (
  <div className="add-product-form">
    <form onSubmit={handleSubmit} className="product-form">
      <button className="close-form-btn" onClick={handleCloseForm}>
        X
      </button>
      <h3>Add a Product</h3>
      {page === 1 && (
        <div>
          <div className="form-group">
            <label htmlFor="productName">Product Name:</label>
            <input
              type="text"
              id="productName"
              name="productname"
              onChange={handleInputChange}
              value={formData.productname || ''}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="productDesc">Product Description:</label>
            <input
              type="text"
              id="productDesc"
              name="productdesc"
              onChange={handleInputChange}
              value={formData.productdesc || ''}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              onChange={handleInputChange}
              value={formData.quantity || ''}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              className="form-control"
              onChange={handleInputChange}
              value={formData.category || ''}
              required
            >
              <option value="">Select Category</option>
              <option value="Wheat">Wheat</option>
              <option value="Rice">Rice</option>
              <option value="Jowar">Jowar</option>
              <option value="Bajra">Bajra</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              onChange={handleInputChange}
              value={formData.location || ''}
              required
            />
          </div>
          <button className="next-btn" onClick={handleNext}>
            Next
          </button>
        </div>
      )}

      {/* Second page of the form */}
      {page === 2 && (
        <div>
          <div className="form-group">
            <label htmlFor="startingBid">Starting Bid:</label>
            <input
              type="number"
              id="startingBid"
              name="startingBid"
              onChange={handleInputChange}
              value={formData.startingBid || ''}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="regularBid">Regular Bid:</label>
            <input
              type="number"
              id="regularBid"
              name="regularBid"
              onChange={handleInputChange}
              value={formData.regularBid || ''}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Due Date:</label>
            <input
              type="datetime-local"
              id="dueDate"
              name="dueDate"
              onChange={handleInputChange}
              value={formData.dueDate || ''}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              name="productimage"
              accept="image/*"
              onChange={handleInputChange}
              required
            />
          </div>
          <button className="prev-btn" onClick={handlePrevious}>
            Previous
          </button>
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </div>
      )}
    </form>
  </div>
)}
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
    <Modal.Title>Registration Failed</Modal.Title>
  </Modal.Header>
  <Modal.Body>Your registration Failed. Please try again.</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setshowRError(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>
      </div>

      {/* Bidding Zone Popup */}
      {showBiddingZone && (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {`Product ID: ${productInfo.productId} - ${productInfo.productName}`}
                </h5>
                <button type="button" className="close" onClick={() => setShowBiddingZone(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <h4>Previous Bids:</h4>
                {/* Display previous bids here */}
                <input
                  type="number"
                  value={inputBid}
                  onChange={(e) => setInputBid(e.target.value)}
                  placeholder="Enter your bid"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handlePlaceBid}>
                  Place Bid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Products;
