"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { SignInSchema } from "@/types"
import { signIn } from "@/actions/auth.actions"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function SignInForm() {
  const router = useRouter()

  const [domains, setDomains] = useState<{ label: string; value: string; isActive: boolean; }[]>([])

  const getDomains = async () => {
    const res = await fetch("/api/domain")
    const data = await res.json()
    return data
  }

  // Fetch domains when the component mounts
  useEffect(() => {
    const fetchDomains = async () => {
      const domainData = await getDomains()
      // Map the fetched domains to { label, value } format for the Select component
      const formattedDomains = domainData.map((domain: any) => ({
        label: domain.domain, 
        value: domain.id,
        isActive: domain.isActive,
      }))
      
      setDomains(formattedDomains)
    }

    fetchDomains()
  }, [])

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
      domain: "",
    },
  })

  async function onSubmit(values: z.infer<typeof SignInSchema>) {
    const res = await signIn(values)
    if (res.error) {
      toast({
        variant: "destructive",
        description: res.error,
      })
    } else if (res.success) {
      toast({
        variant: "default",
        description: "Signed in successfully",
      })
      router.push("/")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {/* Username Field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="****" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Domain Select Field */}
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => form.setValue("domain", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Domains</SelectLabel>
                      <SelectSeparator />
                      {domains.map((domain) => (
                        <SelectItem key={domain.value} value={domain.value} disabled={!domain.isActive}>
                          {domain.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
