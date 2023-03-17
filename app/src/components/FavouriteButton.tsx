"use client";

import clsx from "clsx";
import { type MouseEventHandler } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

interface Props {
  isFavourite?: boolean;
  title: string;
}

const FavouriteButton = ({ isFavourite, title }: Props) => {
  const handleClick: MouseEventHandler = (e) => {
    e.preventDefault();
    console.log("Toggle favourite");
  };

  return (
    <button
      title={
        isFavourite
          ? `Remove ${title} from your favourites`
          : `Add ${title} to your favourites`
      }
      className={clsx({
        "rounded p-2 hover:bg-slate-500": true,
        "text-amber-400": isFavourite,
        "text-sky-400": !isFavourite,
      })}
      type="button"
      onClick={handleClick}
    >
      {isFavourite ? <FaStar /> : <FaRegStar />}
    </button>
  );
};

export default FavouriteButton;
