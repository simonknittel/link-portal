"use client";

import { type Link, type Project, type Tag } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FaEdit, FaSave, FaSpinner } from "react-icons/fa";
import Button from "../../../../../../components/Button";

interface FormValues {
  title: Link["title"];
  description: Link["description"];
  href: Link["href"];
  tagIds: Tag["id"][];
}

interface BaseProps {
  tags: Tag[];
  handleSuccess?: () => void;
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

const CreateOrEditLinkForm = (props: Props) => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: async () => {
      if ("link" in props) {
        try {
          const response = await fetch(`/api/link/${props.link.id}`);

          if (response.ok) {
            const data = (await response.json()) as Link & { tags: Tag[] };

            return {
              title: data.title,
              description: data.description || "",
              href: data.href,
              tagIds: data.tags.map((tag) => tag.id),
            };
          } else if (response.status === 401) {
            toast.error("You are not authorized to view this link.");
          } else {
            toast.error("There has been an error retrieving the link data.");
          }
        } catch (error) {
          toast.error("There has been an error retrieving the link data.");
          console.error(error);
        }
      }

      return {
        title: "",
        description: "",
        href: "",
        tagIds: [],
      };
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);

    if ("projectId" in props) {
      try {
        const response = await fetch("/api/links", {
          method: "POST",
          body: JSON.stringify({
            projectId: props.projectId,
            title: data.title,
            description: data.description,
            href: data.href,
            tagIds: data.tagIds,
          }),
        });

        if (response.ok) {
          toast.success("Successfully created link");
          router.refresh();
          props.handleSuccess?.();
          reset();
        } else if (response.status === 401) {
          toast.error(
            "You are not authorized to create a link for this project."
          );
        } else {
          toast.error("There has been an error while creating the link.");
        }
      } catch (error) {
        toast.error("There has been an error while creating the link.");
        console.error(error);
      }
    } else {
      try {
        const response = await fetch(`/api/link/${props.link.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            href: data.href,
            tagIds: data.tagIds,
          }),
        });

        if (response.ok) {
          toast.success("Successfully updated link");
          router.refresh();
          props.handleSuccess?.();
          reset();
        } else if (response.status === 401) {
          toast.error("You are not authorized to update this link.");
        } else {
          toast.error("There has been an error while updating the link.");
        }
      } catch (error) {
        toast.error("There has been an error while updating the link.");
        console.error(error);
      }
    }

    setIsLoading(false);
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)}>
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
        {props.tags
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.title}
            </option>
          ))}
      </select>

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

export default CreateOrEditLinkForm;
