import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import Avatar from "./Avatar";
import LogoutButton from "./LogoutButton";

const Account = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex items-center justify-between border-b-2 border-slate-800 px-8 py-4">
      <div className="flex items-center gap-4">
        <div className="overflow-hidden rounded">
          <Avatar
            name={session!.user.name}
            image={session!.user.image}
            size={32}
          />
        </div>

        <div>
          <p>{session!.user.name}</p>
          <p className="text-sm text-slate-500">{session!.user.email}</p>
        </div>
      </div>

      <LogoutButton />
    </div>
  );
};

export default Account;
