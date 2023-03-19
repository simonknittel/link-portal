"use client";

import { type Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSpinner, FaTrash } from "react-icons/fa";
import Button from "./Button";

interface Props {
  project: Project;
}

const DeleteProjectButton = ({ project }: Props) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    setIsDeleting(true);

    const confirm = window.confirm(
      `You are about to delete project "${project.name}". Do you want to continue?`
    );

    if (!confirm) {
      setIsDeleting(false);
      return;
    }

    try {
      const response = await fetch(`/api/project/${project.id}`, {
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
    <Button
      onClick={() => void handleClick()}
      className="mt-6"
      disabled={isDeleting}
      colorScheme="red"
    >
      {isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
      Delete project
    </Button>
  );
};

export default DeleteProjectButton;
