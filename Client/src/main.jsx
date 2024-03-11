import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import store from './store/index.jsx';
import { Provider } from 'react-redux';
import { MetamaskContextProvider } from './Hooks/useMetamask.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <MetamaskContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MetamaskContextProvider>
  </Provider>
)
