import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import { store, persistor } from "./app/store.js";
import { PersistGate } from "redux-persist/integration/react";
import Modal from "react-modal";
import SocketProvider from "./services/socketProvider.jsx";
Modal.setAppElement("#root");
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </SocketProvider>
    </Provider>
  </React.StrictMode>
);
