"use client";

import { type Project, type ProjectMember, type User } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaRegTrashAlt, FaSpinner } from "react-icons/fa";
import Avatar from "../../../../../../components/Avatar";
import Button from "../../../../../../components/Button";

interface Props {
  project: Project;
  projectMembers: (ProjectMember & { user: User })[];
}

type Row = ProjectMember & { user: User };

const columnHelper = createColumnHelper<Row>();

const ProjectMembersTable = ({ project, projectMembers }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<User["id"] | null>(null);

  const handleRemove = async (user: User) => {
    setIsLoading(user.id);

    try {
      const confirmation = window.confirm(
        `You are about to remove "${user.name}" from project "${project.name}". Do you want to continue?`
      );

      if (!confirmation) {
        setIsLoading(null);
        return;
      }

      const response = await fetch("/api/project-member", {
        method: "DELETE",
        body: JSON.stringify({
          projectId: project.id,
          userId: user.id,
        }),
      });

      if (response.ok) {
        router.refresh();
        toast.success("Successfully removed project member");
      } else {
        toast.error(
          "There has been an error while removing the project member."
        );
      }
    } catch (error) {
      toast.error("There has been an error while removing the project member.");
      console.error(error);
    }

    setIsLoading(null);
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
          const adminCount = projectMembers.reduce(
            (count, projectMember) =>
              projectMember.role === 2 ? count + 1 : count,
            0
          );

          if (adminCount < 2 && props.row.original.role === 2) return null;

          return (
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => void handleRemove(props.row.original.user)}
                variant="secondary"
                title={`Remove user "${props.row.original.user.name}" from project "${project.name}"`}
                aria-label={`Remove user "${props.row.original.user.name}" from project "${project.name}"`}
                iconOnly={true}
                disabled={Boolean(isLoading)}
              >
                {isLoading === props.row.original.userId ? (
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
  }, [projectMembers.length, project.name, isLoading]);

  const table = useReactTable({
    data: projectMembers,
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
            className="grid grid-cols-[1fr_1fr_1fr_8rem] items-center gap-4 hover:bg-slate-600 px-2 h-14 rounded -mx-2 first:mt-2"
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

export default ProjectMembersTable;
