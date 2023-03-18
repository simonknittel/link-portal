"use client";

import { init } from "@paralleldrive/cuid2";
import { useForm } from "react-hook-form";
import { FaSave } from "react-icons/fa";
import slugify from "slugify";
import Button from "./Button";
import Modal from "./Modal";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
}

const CreateTeamModal = ({ isOpen, onRequestClose }: Props) => {
  // const createMutation = api.team.create.useMutation();
  const { register, handleSubmit, watch, setValue } = useForm();

  const onSubmit = async (data) => {
    // const createdTeam = await createMutation.mutateAsync({
    //   name: data.name,
    //   slug: data.slug,
    // });

    console.log("createdTeam", createdTeam);
  };

  watch((data, { name }) => {
    if (name !== "name") return;

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

      <form onSubmit={handleSubmit(onSubmit)}>
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
          <Button type="submit">
            <FaSave />
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTeamModal;
