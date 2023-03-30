"use client";

import { type Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaSpinner, FaTrash } from "react-icons/fa";
import Button from "../../../../../../components/Button";

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

      if (response.ok) {
        router.push("/app");
        toast.success("Successfully deleted project");
      } else {
        toast.error("There has been an error while deleting the project.");
      }
    } catch (error) {
      toast.error("There has been an error while deleting the project.");
      console.error(error);
    }

    setIsDeleting(false);
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
