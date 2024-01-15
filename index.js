import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './Router';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AppRouter />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);