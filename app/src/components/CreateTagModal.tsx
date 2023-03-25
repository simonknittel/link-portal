"use client";

import { type Project, type Tag } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaPlus, FaSave, FaSpinner } from "react-icons/fa";
import Button from "./Button";
import Modal from "./Modal";

interface FormValues {
  title: Tag["title"];
  description: Tag["description"];
}

interface Props {
  projectId: Project["id"];
}

const CreateTagModal = ({ projectId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [isCreating, setIsCreating] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsCreating(true);

    try {
      await fetch("/api/tags", {
        method: "POST",
        body: JSON.stringify({
          projectId,
          title: data.title,
          description: data.description,
        }),
      });

      router.refresh();
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error(error);
    }

    setIsCreating(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <FaPlus />
        Create
      </Button>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="w-[480px]"
      >
        <h2 className="text-xl font-bold">Create new tag</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="mt-4 block">Title</label>
          <input
            className="h-11 w-full rounded bg-slate-600 px-4"
            {...register("title", { required: true })}
            autoFocus
          />

          <label className="mt-4 block">Description</label>
          <input
            className="h-11 w-full rounded bg-slate-600 px-4"
            {...register("description")}
          />

          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={isCreating}>
              {isCreating ? <FaSpinner className="animate-spin" /> : <FaSave />}
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreateTagModal;
