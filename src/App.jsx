import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import All from "./pages/All";
import Post from "./pages/Post";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./components/NotFound";
import NoResults from "./components/NoResults";
import Loading from "./components/Loading";

import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { pathname } = useLocation();
  const navHidePath = ["/login", "/signup"];

  useEffect(() => {
    const handleLoad = () => {
      setIsLoading(false);
    };

    // Listen for the window load event
    window.addEventListener("load", handleLoad);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  if (isLoading) {
    return <Loading />;
  }

  const hideNavbar = navHidePath.includes(pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/all/:sectionUrl" element={<All />} />
        <Route path="/post/:titleUrl" element={<Post />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/no-results" element={<NoResults />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />{" "}
      </Routes>
      {!hideNavbar && <Footer />}
    </>
  );
}

export default App;
