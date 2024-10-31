"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { Badge } from "@/components/ui/badge";

import { labelRoles, accountStatuses } from "@/components/table/data";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

import { DataTableRowActions } from "@/components/table/data-table-row-actions";

import { UserSchema } from "@/types";

export const columns: ColumnDef<UserSchema>[] = [
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
    size: 50, // Adjust as needed
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Identyfikator" />
    ),
    cell: ({ row }) => <div className="w-[20]">{row.getValue("id")}</div>,
    size: 80, // Width in pixels
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => {
      const label = labelRoles.find((label) => label.value === row.original.role);

      return (
        <div className="flex items-center space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="flex-grow max-w-[500px] truncate font-medium">{row.getValue("username")}</span>
        </div>
      );
    },
    size: 200, // Adjust width
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => <div className="w-32">{row.getValue("firstname")}</div>,
    size: 100,
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => <div className="w-32">{row.getValue("lastname")}</div>,
    size: 100,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="w-50">{row.getValue("email")}</div>,
    size: 200,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => <div className="w-40">{row.getValue("phone")}</div>,
    size: 120,
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
        <div className="flex w-32 items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    size: 100,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {

      return (
        <div className="w-30">
          <DataTableRowActions row={row} />
        </div>
      )
    }
  },
];