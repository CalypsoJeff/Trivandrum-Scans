import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import {store,  persistor } from "./app/store.js";
import { PersistGate } from "redux-persist/integration/react";
import Modal from 'react-modal'
Modal.setAppElement('#root');
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
         <BrowserRouter>
          <Toaster/>
          <App/>
        </BrowserRouter>
       </PersistGate>
    </Provider>
  </React.StrictMode>,
);
