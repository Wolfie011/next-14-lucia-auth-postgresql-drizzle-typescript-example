import {
    CheckIcon,
    LockClosedIcon,
    LockOpen1Icon,
    ExclamationTriangleIcon,
    InfoCircledIcon,
  } from "@radix-ui/react-icons"
  
  export const labelRoles = [
    {
      value: "admin",
      label: "Admin",
    },
    {
      value: "mod",
      label: "Moderator",
    },
    {
      value: "user",
      label: "User",
    },
  ]

  export const labelRolePrimary = [
    {
      value: "nonRole",
      label: "No Role",
    },
    {
      value: "IT",
      label: "IT",
    },
    {
      value: "Doctor",
      label: "Doctor",
    },
    {
      value: "Nurse",
      label: "Nurse",
    },
    {
      value: "Technician",
      label: "Technician",
    },
  ]
  
  export const accountStatuses = [
    {
      value: "active",
      label: "Active",
      icon: CheckIcon,
    },
    {
      value: "blocked",
      label: "Blocked",
      icon: LockOpen1Icon,
    },
    {
      value: "disabled",
      label: "Disabled",
      icon: LockClosedIcon,
    },
    {
      value: "not-activated",
      label: "Not Activated",
      icon: InfoCircledIcon,
    },
    {
      value: "canceled",
      label: "Canceled",
      icon: ExclamationTriangleIcon,
    },
  ]
