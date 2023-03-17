import clsx from "clsx";
import LogoutButton from "./LogoutButton";

interface Props {
  className?: string;
}

const Sidebar = ({ className }: Props) => {
  return (
    <div className={clsx(className, "p-8")}>
      <header className="pb-8">
        <h1 className="text-4xl">Link Portal</h1>
      </header>

      <LogoutButton />
    </div>
  );
};

export default Sidebar;
