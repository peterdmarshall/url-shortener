import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button class='bg-red-500 text-white font-bold py-2 px-4 rounded hover:text-red-800 hover:border-black-400 focus:outline-none' 
            onClick={() => logout({ returnTo: window.location.origin })}
    >
      Log Out
    </button>
  );
};

export default LogoutButton;