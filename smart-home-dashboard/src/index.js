import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router';
import { Provider } from 'mobx-react';
import devicesStore from "./stores/devices";
import authStore from "./stores/auth";


const root = ReactDOM.createRoot(document.getElementById('root'));

const stores = {
  devicesStore: devicesStore,
  authStore: authStore
};

root.render(
  <Provider {...stores}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

reportWebVitals();
