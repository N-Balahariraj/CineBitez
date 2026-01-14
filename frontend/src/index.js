// React Components
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Redux
import { Provider } from "react-redux";
import { store } from "./app/store";

// AG-Grid 
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import "../src/StyleSheets/App.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const rootElement = document.getElementById("root");

const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
