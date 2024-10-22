"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { Badge } from "@/components/ui/badge";

import { labelRoles, accountStatuses } from "@/components/table/data";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

import { DataTableRowActions } from "@/components/table/data-table-row-actions";

import { UserAdditionalSchema } from "@/types";

export const columns: ColumnDef<UserAdditionalSchema>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    // Let the table calculate the width based on content
    minSize: 50,
    maxSize: 60,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Identyfikator" />
    ),
    cell: ({ row }) => <div className="truncate">{row.getValue("id")}</div>,
    minSize: 80,
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => {
      const label = labelRoles.find((label) => label.value === row.original.role);

      return (
        <div className="flex items-center space-x-2 min-w-0">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="flex-grow truncate font-medium">{row.getValue("username")}</span>
        </div>
      );
    },
    minSize: 150,
    maxSize: 200,
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => <div className="truncate">{row.getValue("firstname")}</div>,
    minSize: 100,
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => <div className="truncate">{row.getValue("lastname")}</div>,
    minSize: 100,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="truncate">{row.getValue("email")}</div>,
    minSize: 200,
    maxSize: 300,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => <div className="truncate">{row.getValue("phone")}</div>,
    minSize: 100,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = accountStatuses.find((status) => status.value === row.getValue("status"));

      if (!status) {
        return null;
      }

      return (
        <div className="flex items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    minSize: 80,
    maxSize: 100,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="w-10">
          <DataTableRowActions row={row} />
        </div>
      );
    },
    minSize: 50,
  },
];
