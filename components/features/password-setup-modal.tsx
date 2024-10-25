// components/password-setup-modal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newPasswordSchema } from "@/types";
import { setNewPassword } from "@/actions/user.actions";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";

export function PasswordSetupModal() {
  const router = useRouter()

  const [open, setOpen] = useState(true); // Control for modal visibility

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof newPasswordSchema>) {
    console.log("testStart");
    const res = await setNewPassword(values);
    if (res.error) {
      toast({
        variant: "destructive",
        description: res.error,
      });
    } else if (res.success) {
      toast({
        variant: "default",
        description: "Account activated successfully",
      });
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex items-center justify-center bg-black">
        <div className="p-6 rounded-lg shadow-lg w-full max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              Set Up New Password
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 text-center">
              Your account is not activated. Please set a new password to
              activate it.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              id="newPasswordForm"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter new password"
                        type="password"
                        {...field}
                        className="w-full border rounded-md p-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Re-enter password"
                        type="password"
                        {...field}
                        className="w-full border rounded-md p-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button
              form="newPasswordForm"
              type="submit"
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Set Password
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
