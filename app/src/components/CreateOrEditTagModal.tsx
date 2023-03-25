"use client";

import { type Project, type Tag } from "@prisma/client";
import { useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import Button from "./Button";
import CreateOrEditTagForm from "./CreateOrEditTagForm";
import Modal from "./Modal";

interface NewProps {
  projectId: Project["id"];
}

interface EditProps {
  tag: Tag;
}

type Props = NewProps | EditProps;

const CreateOrEditTagModal = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {"projectId" in props ? (
        <Button onClick={() => setIsOpen(true)}>
          <FaPlus />
          Create
        </Button>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          variant="secondary"
          iconOnly={true}
        >
          <FaEdit />
        </Button>
      )}

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="w-[480px]"
      >
        <h2 className="text-xl font-bold">
          {"projectId" in props ? "Create new tag" : "Update tag"}
        </h2>

        <CreateOrEditTagForm
          {...props}
          handleSuccess={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
};

export default CreateOrEditTagModal;
