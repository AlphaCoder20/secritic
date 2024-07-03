import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

<<<<<<< HEAD
import ReactGA from "react-ga4";
import { AllPostsProvider } from "./contexts/AllPostsProvider"; // Adjust the path as necessary

ReactGA.initialize("G-QK2T5N8MC9");

// Send pageview with a custom path
// ReactGA.send({ hitType: "pageview", page: "/logiin", title: "suiii" });
=======
import { AllPostsProvider } from "./contexts/AllPostsProvider";
>>>>>>> 64e24aa (Updated)

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AllPostsProvider>
      <App />
    </AllPostsProvider>
  </BrowserRouter>
);
