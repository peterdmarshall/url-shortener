import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {

    const { loginWithRedirect } = useAuth0();

    return (
        <button class='bg-indigo-600 text-white font-bold py-2 px-5 rounded hover:text-indigo-800 hover:border-black-400 focus:outline-none' 
                onClick={() => loginWithRedirect()}
        >
            Log In
        </button>
    );
};

export default LoginButton;