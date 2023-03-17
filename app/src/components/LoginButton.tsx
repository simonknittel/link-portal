"use client";

import clsx from "clsx";
import { signIn } from "next-auth/react";
import Button from "./Button";

interface Props {
  className?: string;
}

const LoginButton = ({ className }: Props) => {
  return (
    <Button
      className={clsx(className, "w-full")}
      onClick={() => signIn("github")}
    >
      Login with GitHub
    </Button>
  );
};

export default LoginButton;
