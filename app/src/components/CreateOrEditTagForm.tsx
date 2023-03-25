"use client";

import { type Project, type Tag } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEdit, FaSave, FaSpinner } from "react-icons/fa";
import Button from "./Button";

interface FormValues {
  title: Tag["title"];
  description: Tag["description"];
}

interface BaseProps {
  handleSuccess?: () => void;
}

interface NewProps {
  projectId: Project["id"];
}

interface EditProps {
  tag: Tag;
}

type Props = (NewProps | EditProps) & BaseProps;

const CreateOrEditTagForm = (props: Props) => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: async () => {
      if ("tag" in props) {
        try {
          const response = await fetch(`/api/tag/${props.tag.id}`);

          if (response.ok) {
            const data = (await response.json()) as Tag;

            return {
              title: data.title,
              description: data.description || "",
            };
          } else {
            toast.error("There has been an error retrieving the tag data.");
          }
        } catch (error) {
          toast.error("There has been an error retrieving the tag data.");
          console.error(error);
        }
      }

      return {
        title: "",
        description: "",
      };
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);

    if ("projectId" in props) {
      try {
        const response = await fetch("/api/tags", {
          method: "POST",
          body: JSON.stringify({
            projectId: props.projectId,
            title: data.title,
            description: data.description,
          }),
        });

        if (response.ok) {
          toast.success("Tag successfully created");
          router.refresh();
          props.handleSuccess?.();
          reset();
        } else {
          toast.error("There has been an issue creating the tag.");
        }
      } catch (error) {
        toast.error("There has been an issue creating the tag.");
        console.error(error);
      }
    } else {
      try {
        const response = await fetch(`/api/tag/${props.tag.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            title: data.title,
            description: data.description,
          }),
        });

        if (response.ok) {
          toast.success("Tag successfully updated");
          router.refresh();
          props.handleSuccess?.();
          reset();
        } else {
          toast.error("There has been an issue updating the tag.");
        }
      } catch (error) {
        toast.error("There has been an issue updating the tag.");
        console.error(error);
      }
    }

    setIsLoading(false);
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
        <Button type="submit" disabled={isLoading}>
          {"projectId" in props ? (
            <>
              {isLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
              Create
            </>
          ) : (
            <>
              {isLoading ? <FaSpinner className="animate-spin" /> : <FaEdit />}
              Update
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateOrEditTagForm;
