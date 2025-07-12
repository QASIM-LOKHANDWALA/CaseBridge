import React from "react";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import toast, { Toaster } from "react-hot-toast";
import ClientHome from "./pages/ClientHome";

const App = () => {
    return (
        <div>
            {/* <AuthPage /> */}

            <ClientHome />
            <Toaster />
        </div>
    );
};

export default App;
