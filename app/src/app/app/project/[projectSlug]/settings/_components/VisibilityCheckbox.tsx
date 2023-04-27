"use client";

import { type Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { FaSave, FaSpinner } from "react-icons/fa";
import Button from "~/components/Button";

interface Props {
  project: Project;
}

interface FormValues {
  isPublic: boolean;
}

const VisibilityCheckbox = ({ project }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      isPublic: Boolean(project.isPublic),
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/project/${project.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          isPublic: data.isPublic,
        }),
      });

      if (response.ok) {
        router.refresh();
        toast.success("Successfully changed project visibility");
      } else {
        toast.error(
          "There has been an error while changing project visibility."
        );
      }
    } catch (error) {
      toast.error("There has been an error while changing project visibility.");
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-4 flex gap-2">
        <input type="checkbox" id="isPublic" {...register("isPublic")} />
        <label htmlFor="isPublic">Public</label>
      </div>

      <Button type="submit" disabled={isLoading} className="mt-4">
        {isLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
        Save
      </Button>
    </form>
  );
};

export default VisibilityCheckbox;
