"use client";

import { type Tag } from "@prisma/client";
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
import CreateOrEditTagModal from "./CreateOrEditTagModal";

interface Props {
  tags: Tag[];
}

type Row = Tag;

const columnHelper = createColumnHelper<Row>();

const TagsTable = ({ tags }: Props) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<Tag["id"] | null>(null);

  const handleDelete = async (tag: Tag) => {
    setIsDeleting(tag.id);

    try {
      const confirmation = window.confirm(
        `You are about to delete the tag "${tag.title}". Do you want to continue?`
      );

      if (!confirmation) {
        setIsDeleting(null);
        return;
      }

      const response = await fetch(`/api/tag/${tag.id}`, {
        method: "DELETE",
      });

      if (!response.ok) return;

      router.refresh();
    } catch (error) {}

    setIsDeleting(null);
  };

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("title", {
        header: "Title",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (props) => props.getValue(),
      }),
      columnHelper.display({
        id: "actions",
        cell: (props) => (
          <div className="flex justify-end gap-2">
            <CreateOrEditTagModal tag={props.row.original} />

            <Button
              onClick={() => void handleDelete(props.row.original)}
              variant="secondary"
              title={`Delete tag "${props.row.original.title}"`}
              aria-label={`Delete tag "${props.row.original.title}"`}
              iconOnly={true}
              disabled={Boolean(isDeleting)}
            >
              {isDeleting === props.row.original.id ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaRegTrashAlt />
              )}
            </Button>
          </div>
        ),
      }),
    ];
  }, [tags.length, isDeleting]);

  const table = useReactTable({
    data: tags,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr
            key={headerGroup.id}
            className="grid grid-cols-[1fr_2fr_8rem] items-center gap-4 text-xl"
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
            className="grid grid-cols-[1fr_2fr_8rem] items-center gap-4 hover:bg-slate-600 px-2 h-14 rounded -mx-2 first:mt-2"
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

export default TagsTable;
