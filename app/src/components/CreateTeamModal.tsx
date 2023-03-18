"use client";

import { init } from "@paralleldrive/cuid2";
import { type Team } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaSave, FaSpinner } from "react-icons/fa";
import slugify from "slugify";
import Button from "./Button";
import Modal from "./Modal";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
}

interface FormValues {
  name: string;
  slug: string;
}

const CreateTeamModal = ({ isOpen, onRequestClose }: Props) => {
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm<FormValues>();
  const [isCreating, setIsCreating] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsCreating(true);

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          slug: data.slug,
        }),
      });

      const createdTeam = (await response.json()) as Team;

      router.push(`/app/team/${createdTeam.slug}`);
    } catch (error) {
      setIsCreating(false);
    }
  };

  watch((data, { name }) => {
    if (name !== "name" || !data["name"]) return;

    const slugifiedName = slugify(data["name"], {
      lower: true,
      strict: true,
    });

    const createId = init({
      length: 10,
    });
    const slugWithCuid = slugifiedName + "-" + createId();

    setValue("slug", slugWithCuid);
  });

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="w-[480px]"
    >
      <h2 className="text-xl font-bold">Create new team</h2>

      <form onSubmit={() => void handleSubmit(onSubmit)}>
        <label className="mt-4 block">Name</label>
        <input
          className="h-11 w-full rounded bg-slate-600 px-4"
          {...register("name", { required: true })}
          autoFocus
        />

        <label className="mt-4 block">Slug</label>
        <input
          className="h-11 w-full rounded bg-slate-600 px-4 text-slate-400 pointer-events-none"
          {...register("slug", { required: true })}
          readOnly
        />

        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={isCreating}>
            {isCreating ? <FaSpinner className="animate-spin" /> : <FaSave />}
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTeamModal;
