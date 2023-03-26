"use client";

import {
  type InvitedProjectMember,
  type Project,
  type User,
} from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FaRegTrashAlt, FaSpinner } from "react-icons/fa";
import Button from "./Button";

interface Props {
  project: Project;
  invitedProjectMembers: InvitedProjectMember[];
}

type Row = InvitedProjectMember;

const columnHelper = createColumnHelper<Row>();

const InvitedProjectMembersTable = ({
  project,
  invitedProjectMembers,
}: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<User["id"] | null>(null);

  const handleRemove = async (invitedProjectMember: InvitedProjectMember) => {
    setIsLoading(invitedProjectMember.email);

    try {
      const confirmation = window.confirm(
        `You are about to remove "${invitedProjectMember.email}" from project "${project.name}". Do you want to continue?`
      );

      if (!confirmation) {
        setIsLoading(null);
        return;
      }

      const response = await fetch("/api/project-member", {
        method: "DELETE",
        body: JSON.stringify({
          projectId: project.id,
          email: invitedProjectMember.email,
        }),
      });

      if (!response.ok) return;

      router.refresh();
    } catch (error) {}

    setIsLoading(null);
  };

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("email", {
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
        cell: (props) => (
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => void handleRemove(props.row.original)}
              variant="secondary"
              title={`Remove user "${props.row.original.email}" from project "${project.name}"`}
              aria-label={`Remove user "${props.row.original.email}" from project "${project.name}"`}
              iconOnly={true}
              disabled={Boolean(isLoading)}
            >
              {isLoading === props.row.original.email ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaRegTrashAlt />
              )}
            </Button>
          </div>
        ),
      }),
    ];
  }, [invitedProjectMembers.length, project.name, isLoading]);

  const table = useReactTable({
    data: invitedProjectMembers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="mt-4 w-full">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr
            key={headerGroup.id}
            className="grid grid-cols-[1fr_1fr_8rem] items-center gap-4"
          >
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="text-left text-slate-400">
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
            className="grid grid-cols-[1fr_1fr_8rem] items-center gap-4 hover:bg-slate-600 px-2 h-14 rounded -mx-2 first:mt-2"
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="overflow-hidden text-ellipsis">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InvitedProjectMembersTable;
