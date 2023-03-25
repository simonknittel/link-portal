import { type Link } from "@prisma/client";
import Avatar from "./Avatar";
import FavouriteButton from "./FavouriteButton";

interface Props {
  link: Link;
  isFavourite?: boolean;
}

const DashboardItem = ({
  link: { title, description, href },
  isFavourite,
}: Props) => {
  return (
    <li>
      <a
        href={href}
        className="flex h-full gap-4 rounded bg-slate-700 p-4 hover:bg-slate-600"
      >
        <span className="flex-none">
          <Avatar name={title} />
        </span>

        <div className="flex-1">
          <p className="font-bold">{title}</p>
          <p className="leading-tight mt-2">{description}</p>
          <p
            title={href}
            className="text-slate-500 leading-tight mt-2 text-xs whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {href}
          </p>
        </div>

        <div className="flex-none">
          <FavouriteButton isFavourite={isFavourite} title={title} />
        </div>
      </a>
    </li>
  );
};

export default DashboardItem;
