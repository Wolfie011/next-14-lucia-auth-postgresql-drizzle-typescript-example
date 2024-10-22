"use client";

import {
  ClipboardCopyIcon,
  DotsHorizontalIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { labelRoles } from "@/components/table/data";
import { userSchemaAdditional } from "@/types/index";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const user = userSchemaAdditional.parse(row.original);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {/* Edit button */}
        <DropdownMenuItem asChild>
          <Button variant="outline" className="flex w-full items-center justify-between gap-x-2">
            Edit
            <Pencil1Icon className="h-4 w-4" />
          </Button>
        </DropdownMenuItem>

        {/* Copy ObjectId button */}
        <DropdownMenuItem asChild className="my-1">
          <Button variant="outline" className="flex w-full items-center justify-between gap-x-2">
            Copy ObjectId
            <ClipboardCopyIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Role selection submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-x-2">
            Role
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={user.role}>
              {labelRoles.map((label) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Delete button */}
        <DropdownMenuItem asChild>
          <Button variant="destructive" className="h-8 w-full">
            Delete
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
