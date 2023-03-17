"use client";

import { useState } from "react";
import { FaRegPlusSquare } from "react-icons/fa";
import Modal from "./Modal";

const NewSharedLinkModalButton = () => {
  const [showNewSharedLinkModal, setShowNewSharedLinkModal] = useState(false);

  return (
    <>
      <button
        title="Add shared link"
        type="button"
        className="rounded p-2 text-xl text-sky-400 hover:bg-slate-700"
        onClick={() => setShowNewSharedLinkModal(true)}
      >
        <FaRegPlusSquare />
      </button>

      <Modal
        isOpen={showNewSharedLinkModal}
        onRequestClose={() => setShowNewSharedLinkModal(false)}
        className="w-[480px]"
      >
        <h2 className="text-xl font-bold">Add new shared link</h2>
      </Modal>
    </>
  );
};

export default NewSharedLinkModalButton;
