"use client";

import { useState } from "react";
import { FaRegPlusSquare } from "react-icons/fa";
import CreateTeamModal from "./CreateTeamModal";

const CreateTeamButton = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <>
      <button
        className="p-4 flex gap-2 items-center hover:bg-slate-700 text-sky-500 rounded w-full justify-center"
        onClick={() => setModalIsOpen(true)}
      >
        <FaRegPlusSquare /> Create new team
      </button>

      <CreateTeamModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      />
    </>
  );
};

export default CreateTeamButton;
