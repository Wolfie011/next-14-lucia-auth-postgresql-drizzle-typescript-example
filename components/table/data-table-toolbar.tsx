"use client";
import { DropdownMenuIcon, MagicWandIcon } from "@radix-ui/react-icons";
import {
  Cross2Icon,
  TrashIcon,
  LockClosedIcon,
  LockOpen2Icon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";

import { accountStatuses, labelRoles, labelRolePrimary } from "@/components/table/data";
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { CreateUserDialog } from "@/components/forms/createUserDialog";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="hidden h-8 lg:flex">
              <MagicWandIcon className="mr-2 h-4 w-4" />
              Dodatkowe akcje
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Button variant="ghost" className="w-full">
                  Lock account
                  <LockClosedIcon className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button variant="ghost" className="w-full">
                  Unlock account
                  <LockOpen2Icon className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button variant="ghost" className="w-full">
                  Delete
                  <TrashIcon className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Input
          placeholder="Filter username..."
          value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[120px] lg:w-[200px]"
        />
        <Input
          placeholder="Filter email..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[120px] lg:w-[200px]"
        />

        {/* Filter for rolePrimary (labelRolePrimary) */}
        {table.getColumn("roleType") && (
          <DataTableFacetedFilter
            column={table.getColumn("roleType")}
            title="Role Primary"
            options={labelRolePrimary}
          />
        )}
        {/* Filter for roleAccess (labelRoles) */}
        {table.getColumn("roleAccess") && (
          <DataTableFacetedFilter
            column={table.getColumn("roleAccess")}
            title="Role Access"
            options={labelRoles}
          />
        )}



        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={accountStatuses}
          />
        )}
        
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
      <CreateUserDialog />
    </div>
  );
}
