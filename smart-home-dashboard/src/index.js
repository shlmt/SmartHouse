import React from 'react';
import ReactDOM from 'react-dom/client';
import 'index.css';
import App from 'App';
import reportWebVitals from 'reportWebVitals';
import { BrowserRouter } from 'react-router';
import { Provider } from 'mobx-react';
import devicesStore from "stores/devices";
import authStore from "stores/auth";
import alertStore from "stores/alert";
import { SoftUIControllerProvider } from 'context';
import scheduledTasksStore from 'stores/scheduleTasksStore';


const root = ReactDOM.createRoot(document.getElementById('root'));

const stores = {
  devicesStore,
  authStore,
  alertStore,
  scheduledTasksStore
};

root.render(
  <Provider {...stores}>
    <BrowserRouter>
     <SoftUIControllerProvider>
        <App />
      </SoftUIControllerProvider>
    </BrowserRouter>
  </Provider>
);

reportWebVitals();
