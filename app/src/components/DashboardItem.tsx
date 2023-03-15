import clsx from "clsx";
import { type MouseEventHandler, type ReactNode } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

interface Props {
  title: string;
  description: ReactNode;
  href: string;
  isFavourite?: boolean;
  toggleFavouriteHandler?: () => void;
}

const DashboardItem = ({
  title,
  description,
  href,
  isFavourite,
  toggleFavouriteHandler,
}: Props) => {
  const _toggleFavouriteHandler: MouseEventHandler = (e) => {
    e.preventDefault();
    toggleFavouriteHandler?.();
  };

  return (
    <li>
      <a
        href={href}
        className="flex gap-4 rounded bg-slate-800 p-4 hover:bg-slate-700"
      >
        <span className="block overflow-hidden rounded">
          <img
            src="https://via.placeholder.com/64"
            alt={`Logo of ${title}`}
            width={64}
            height={64}
          />
        </span>

        <div className="flex-1">
          <p className="font-bold">{title}</p>
          <p className="text-slate-500">{description}</p>
        </div>

        <div>
          <button
            title={
              isFavourite
                ? `Remove ${title} from your favourites`
                : `Add ${title} to your favourites`
            }
            className={clsx({
              "rounded p-2 hover:bg-slate-600": true,
              "text-amber-400": isFavourite,
              "text-sky-400": !isFavourite,
            })}
            type="button"
            onClick={_toggleFavouriteHandler}
          >
            {isFavourite ? <FaStar /> : <FaRegStar />}
          </button>
        </div>
      </a>
    </li>
  );
};

export default DashboardItem;
