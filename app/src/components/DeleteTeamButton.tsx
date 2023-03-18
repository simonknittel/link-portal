"use client";

import { type Team } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSpinner, FaTrash } from "react-icons/fa";
import Button from "./Button";

interface Props {
  team: Team;
}

const DeleteTeamButton = ({ team }: Props) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    setIsDeleting(true);

    const confirm = window.confirm(
      `You are about to delete team "${team.name}". Do you want to continue?`
    );

    if (!confirm) {
      setIsDeleting(false);
      return;
    }

    try {
      const response = await fetch(`/api/team/${team.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setIsDeleting(false);
        return;
      }

      router.push("/app");
    } catch (error) {
      setIsDeleting(false);
    }
  };

  return (
    <Button onClick={handleClick} className="mt-4" disabled={isDeleting}>
      {isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
      Delete team
    </Button>
  );
};

export default DeleteTeamButton;
