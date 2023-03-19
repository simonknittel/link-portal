"use client";

import { type Team } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaPlusSquare, FaSpinner } from "react-icons/fa";
import Button from "./Button";

interface Props {
  teamId: Team["id"];
}

interface FormValues {
  email: string;
  role: "1" | "2";
}

const AddTeamMember = ({ teamId }: Props) => {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsAdding(true);

    try {
      const response = await fetch("/api/team-member", {
        method: "POST",
        body: JSON.stringify({
          teamId,
          email: data.email,
          role: parseInt(data.role),
        }),
      });

      if (response.ok) {
        reset();
        router.refresh();
      } else {
        // TODO
      }
    } catch (error) {
      // TODO
    }

    setIsAdding(false);
  };

  return (
    <form className="mt-8 flex gap-2" onSubmit={handleSubmit(onSubmit)}>
      <input
        className="bg-slate-600 rounded flex-1 px-4"
        placeholder="Email address"
        {...register("email", { required: true })}
      />

      <select
        className="bg-slate-600 px-4 rounded"
        {...register("role", { required: true })}
      >
        <option value="1">Member</option>
        <option value="2">Admin</option>
      </select>

      <Button type="submit" disabled={isAdding}>
        {isAdding ? <FaSpinner className="animate-spin" /> : <FaPlusSquare />}
        Add
      </Button>
    </form>
  );
};

export default AddTeamMember;
