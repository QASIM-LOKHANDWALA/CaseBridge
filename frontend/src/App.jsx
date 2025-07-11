import React from "react";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import toast, { Toaster } from "react-hot-toast";

const App = () => {
    return (
        <div>
            <AuthPage />
            <Toaster />
        </div>
    );
};

export default App;
