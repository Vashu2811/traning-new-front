import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";

import "./index.css";
import App from "./App";
import { ContextProvider } from "./contexts/ContextProvider";
import store, { persistor } from "../src/store/store";
ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ContextProvider>
    </PersistGate>
  </Provider>,

  document.getElementById("root")
);
