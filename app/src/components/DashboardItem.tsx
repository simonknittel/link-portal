import Image from "next/image";
import { type ReactNode } from "react";
import FavouriteButton from "./FavouriteButton";

interface Props {
  title: string;
  description: ReactNode;
  href: string;
  isFavourite?: boolean;
}

const DashboardItem = ({ title, description, href, isFavourite }: Props) => {
  return (
    <li>
      <a
        href={href}
        className="flex h-full gap-4 rounded bg-slate-700 p-4 hover:bg-slate-600"
      >
        <span>
          <span className="block overflow-hidden rounded">
            <Image
              src="https://via.placeholder.com/64"
              alt={`Logo of ${title}`}
              width={64}
              height={64}
            />
          </span>
        </span>

        <div className="flex-1">
          <p className="font-bold">{title}</p>
          <p className="leading-tight mt-2">{description}</p>
          <p className="text-slate-500 leading-tight mt-2 text-xs">{href}</p>
        </div>

        <div>
          <FavouriteButton isFavourite={isFavourite} title={title} />
        </div>
      </a>
    </li>
  );
};

export default DashboardItem;
