"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import Button from "./Button";

const LoginButtons = () => {
  const [isLoggingIn, setIsLoggingIn] = useState<string | null>(null);

  const handleClick = async (provider: string) => {
    setIsLoggingIn(provider);
    await signIn(provider);
  };

  return (
    <>
      {/* <Button
        onClick={() => void handleClick("azure-ad-b2c")}
        disabled={Boolean(isLoggingIn)}
      >
        {isLoggingIn === "azure-ad-b2c" ? (
          <FaSpinner className="animate-spin" />
        ) : (
          "Login with Microsoft"
        )}
      </Button> */}

      {/* <Button
        onClick={() => void handleClick("google")}
        disabled={Boolean(isLoggingIn)}
      >
        {isLoggingIn === "google" ? (
          <FaSpinner className="animate-spin" />
        ) : (
          "Login with Google"
        )}
      </Button> */}

      <Button
        onClick={() => void handleClick("github")}
        disabled={Boolean(isLoggingIn)}
      >
        {isLoggingIn === "github" ? (
          <FaSpinner className="animate-spin" />
        ) : (
          "Login with GitHub"
        )}
      </Button>
    </>
  );
};

export default LoginButtons;
