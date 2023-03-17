"use client";

import { useState } from "react";
import Modal from "./Modal";

const NewSharedLinkModal = () => {
  const [showNewSharedLinkModal, setShowNewSharedLinkModal] = useState(false);

  return (
    <Modal
      isOpen={showNewSharedLinkModal}
      onRequestClose={() => setShowNewSharedLinkModal(false)}
      className="w-[480px]"
    >
      <h2 className="text-xl font-bold">Add new shared link</h2>
    </Modal>
  );
};

export default NewSharedLinkModal;
