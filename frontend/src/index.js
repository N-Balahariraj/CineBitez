import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "../src/StyleSheets/App.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";

const rootElement = document.getElementById("root");

const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>
);
