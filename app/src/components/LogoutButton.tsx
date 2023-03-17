"use client";

import { signOut } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";
import Button from "./Button";

const LogoutButton = () => {
  return (
    <Button onClick={() => signOut()} variant="secondary">
      <FaSignOutAlt />
      Logout
    </Button>
  );
};

export default LogoutButton;
