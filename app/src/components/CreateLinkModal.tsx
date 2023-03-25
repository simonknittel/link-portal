"use client";

import { type Link, type Project, type Tag } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FaPlus, FaSave, FaSpinner } from "react-icons/fa";
import Button from "./Button";
import Modal from "./Modal";

interface FormValues {
  title: Link["title"];
  description: Link["description"];
  href: Link["href"];
  tagIds: Tag["id"][];
}

interface Props {
  projectId: Project["id"];
  tags: Tag[];
}

const CreateLinkModal = ({ projectId, tags }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [isCreating, setIsCreating] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsCreating(true);

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        body: JSON.stringify({
          projectId,
          title: data.title,
          description: data.description,
          href: data.href,
          tagIds: data.tagIds,
        }),
      });

      if (response.ok) {
        toast.success("Successfully created link");
        router.refresh();
        setIsOpen(false);
        reset();
      } else {
        toast.error("There has been an error while creating the link.");
      }
    } catch (error) {
      toast.error("There has been an error while creating the link.");
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
          {/* <div className="mt-4">
            <Avatar />
          </div> */}

          <label className="block mt-4">Title</label>
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

          <label className="mt-4 block">Href</label>
          <input
            className="h-11 w-full rounded bg-slate-600 px-4"
            {...register("href", { required: true })}
            type="url"
          />

          <label className="mt-4 block">Tags</label>
          <select
            className="w-full rounded bg-slate-600 p-4"
            {...register("tagIds")}
            multiple
            size={5}
          >
            {tags
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.title}
                </option>
              ))}
          </select>

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

export default CreateLinkModal;
