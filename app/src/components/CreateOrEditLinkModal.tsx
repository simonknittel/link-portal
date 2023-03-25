"use client";

import { type Link, type Project, type Tag } from "@prisma/client";
import { useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import Button from "./Button";
import CreateOrEditLinkForm from "./CreateOrEditLinkForm";
import Modal from "./Modal";

interface BaseProps {
  tags: Tag[];
}

interface NewProps {
  projectId: Project["id"];
}

interface EditProps {
  link: Link & {
    tags: Tag[];
  };
}

type Props = (NewProps | EditProps) & BaseProps;

const CreateOrEditLinkModal = (props: Props) => {
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
        <h2 className="text-xl font-bold">Create new tag</h2>

        <CreateOrEditLinkForm
          {...props}
          handleSuccess={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
};

export default CreateOrEditLinkModal;
