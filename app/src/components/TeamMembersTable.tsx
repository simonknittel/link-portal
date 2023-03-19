"use client";

import { type Team, type TeamMember, type User } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FaRegTrashAlt, FaSpinner } from "react-icons/fa";
import Avatar from "./Avatar";
import Button from "./Button";

interface Props {
  team: Team;
  teamMembers: (TeamMember & { user: User })[];
}

type Row = TeamMember & { user: User };

const columnHelper = createColumnHelper<Row>();

const TeamMembersTable = ({ team, teamMembers }: Props) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<User["id"] | null>(null);

  const handleRemove = async (user: User) => {
    setIsDeleting(user.id);

    try {
      const confirmation = window.confirm(
        `You are about to remove "${user.name}" from team "${team.name}". Do you want to continue?`
      );

      if (!confirmation) {
        setIsDeleting(null);
        return;
      }

      const response = await fetch("/api/team-member", {
        method: "DELETE",
        body: JSON.stringify({
          teamId: team.id,
          userId: user.id,
        }),
      });

      if (!response.ok) return;

      router.refresh();
    } catch (error) {}

    setIsDeleting(null);
  };

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("user.name", {
        header: "Name",
        cell: (props) => {
          return (
            <div className="flex gap-2 items-center">
              <Avatar
                name={props.getValue()}
                image={props.row.original.user.image}
                size={32}
              />
              {props.getValue()}
            </div>
          );
        },
      }),
      columnHelper.accessor("user.email", {
        header: "Email address",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("role", {
        header: "Role",
        cell: (props) => {
          switch (props.getValue()) {
            case 1:
              return "Member";

            case 2:
              return "Admin";

            default:
              return "";
          }
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: (props) => {
          const adminCount = teamMembers.reduce(
            (count, teamMember) => (teamMember.role === 2 ? count + 1 : count),
            0
          );

          if (adminCount < 2 && props.row.original.role === 2) return null;

          return (
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => void handleRemove(props.row.original.user)}
                variant="secondary"
                title="Delete"
                aria-label={`Remove "X" from team "${team.name}"`}
                iconOnly={true}
                disabled={Boolean(isDeleting)}
              >
                {isDeleting === props.row.original.userId ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaRegTrashAlt />
                )}
              </Button>
            </div>
          );
        },
      }),
    ];
  }, [teamMembers.length, team.name, isDeleting]);

  const table = useReactTable({
    data: teamMembers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="mt-8 w-full">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr
            key={headerGroup.id}
            className="grid grid-cols-[1fr_1fr_1fr_8rem] items-center gap-4"
          >
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="text-left">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className="grid grid-cols-[1fr_1fr_1fr_8rem] items-center gap-4 hover:bg-slate-600 px-2 h-14 rounded -mx-2 first:mt-2"
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TeamMembersTable;
