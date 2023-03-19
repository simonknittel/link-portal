"use client";

import { type Team, type TeamMember, type User } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import Avatar from "./Avatar";
import Button from "./Button";

interface Props {
  team: Team;
  teamMembers: (TeamMember & { user: User })[];
}

type Row = TeamMember & { user: User };

const columnHelper = createColumnHelper<Row>();

const TeamMembersTable = ({ team, teamMembers }: Props) => {
  const handleRemove = (userId: User["id"]) => {
    console.log("handleRemove", userId);
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
          return (
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => handleRemove(props.row.original.userId)}
                variant="secondary"
                title="Delete"
                aria-label={`Remove "X" from team "${team.name}"`}
                iconOnly={true}
              >
                <FaRegTrashAlt />
              </Button>
            </div>
          );
        },
      }),
    ];
  }, [team.name]);

  const table = useReactTable({
    data: teamMembers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="mt-8 w-full">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
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
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="py-2">
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
