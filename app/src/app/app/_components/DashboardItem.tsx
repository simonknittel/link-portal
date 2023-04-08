import { type Link } from "@prisma/client";
import FavouriteButton from "./FavouriteButton";

interface Props {
  link: Link;
  favourited?: boolean;
}

const DashboardItem = ({ link, favourited }: Props) => {
  const imgSrc = new URL(link.href).origin + "/favicon.ico";

  return (
    <li>
      <a
        href={link.href}
        className="flex h-full gap-4 rounded bg-slate-700 p-4 hover:bg-slate-600"
      >
        <span className="flex-none">
          {/* TODO: Show proper fallback image */}
          <img
            src={imgSrc}
            width={64}
            height={64}
            alt={`Logo of ${link.title}`}
          />
          {/* <Avatar name={link.title} /> */}
        </span>

        <div className="flex-1">
          <p className="font-bold">{link.title}</p>
          <p className="leading-tight mt-2">{link.description}</p>
          <p
            title={link.href}
            className="text-slate-500 leading-tight mt-2 text-xs whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {link.href}
          </p>
        </div>

        <div className="flex-none">
          <FavouriteButton link={link} favourited={favourited} />
        </div>
      </a>
    </li>
  );
};

export default DashboardItem;
