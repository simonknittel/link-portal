"use client";

import { signIn } from "next-auth/react";
import Button from "./Button";

const LoginButtons = () => {
  return (
    <>
      {/* <Button onClick={() => signIn("azure-ad-b2c")}>
        Login with Microsoft
      </Button> */}

      {/* <Button onClick={() => signIn("google")}>Login with Google</Button> */}

      <Button onClick={() => signIn("github")}>Login with GitHub</Button>
    </>
  );
};

export default LoginButtons;
