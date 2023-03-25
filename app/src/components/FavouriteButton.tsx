"use client";

import { type Link } from "@prisma/client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { toast } from "react-hot-toast";
import { FaRegStar, FaSpinner, FaStar } from "react-icons/fa";

interface Props {
  link: Link;
  favourited?: boolean;
}

const FavouriteButton = ({ link, favourited }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/link/${link.id}/favourited`, {
        method: "PATCH",
        body: JSON.stringify({
          favourited: !favourited,
        }),
      });

      if (response.ok) {
        router.refresh();
        toast.success("Successfully toggled favourite");
      } else {
        toast.error("There has been an error while (un)favouriting this link.");
      }
    } catch (error) {
      toast.error("There has been an error while (un)favouriting this link.");
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <button
      title={
        favourited
          ? `Remove ${link.title} from your favourites`
          : `Add ${link.title} to your favourites`
      }
      className={clsx({
        "rounded p-2 hover:bg-slate-500": true,
        "text-amber-400": favourited && !isLoading,
        "text-sky-400": !favourited || isLoading,
      })}
      type="button"
      onClick={(e) => void handleClick(e)}
      disabled={isLoading}
    >
      {isLoading ? (
        <FaSpinner className="animate-spin" />
      ) : favourited ? (
        <FaStar />
      ) : (
        <FaRegStar />
      )}
    </button>
  );
};

export default FavouriteButton;
