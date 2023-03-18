"use client";

import { signOut } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";
import Button from "./Button";

const LogoutButton = () => {
  return (
    <Button
      onClick={() => signOut()}
      variant="secondary"
      title="Logout"
      iconOnly={true}
    >
      <FaSignOutAlt />
    </Button>
  );
};

export default LogoutButton;
