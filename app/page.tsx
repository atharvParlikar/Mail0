"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Discord, GitHub, Twitter, YouTube } from "@/components/icons/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { z } from "zod";

const betaSignupSchema = z.object({
  email: z.string().email().min(9),
});

export default function BetaSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof betaSignupSchema>>({
    resolver: zodResolver(betaSignupSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof betaSignupSchema>) => {
    setIsSubmitting(true);
    try {
      console.log("Starting form submission with email:", values.email);

      const response = await fetch("/api/auth/early-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      // Log the raw response text first
      const rawText = await response.text();
      console.log("Raw response:", rawText);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(rawText);
        console.log("Parsed response data:", data);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      form.reset();
      console.log("Form submission successful");
      toast.success("Thanks for signing up for early access!");
    } catch (error) {
      console.error("Form submission error:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
      });
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      console.log("Form submission completed");
    }
  };

  return (
    <div className="flex h-dvh w-screen items-center justify-center bg-background pt-12 md:pt-0">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader className="py-5">
          <CardTitle className="text-center">Early Access</CardTitle>
          <p className="text-center text-sm text-gray-500 dark:text-zinc-400">
            Enter your email to get access once we launch ❤️
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 uppercase">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs text-gray-600 dark:text-zinc-400">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="placeholder:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-2">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  Join early access
                </Button>
              </div>
            </form>

            <div className="mt-4 flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <Link
                  href="https://discord.gg/5nwrvt3JH2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  <Discord className="h-6 w-6" />
                </Link>
                <Link
                  href="https://github.com/nizzyabi/Mail0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  <GitHub className="h-5 w-5" />
                </Link>
                <Link
                  href="https://x.com/NizzyABI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link
                  href="https://www.youtube.com/@NizzyABI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  <YouTube className="h-6 w-6" />
                </Link>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-center text-sm text-gray-500 dark:text-zinc-400">
                Are you developing?{" "}
                <Link href="/mail" className="underline">
                  Go here
                </Link>
              </p>
              <p className="text-center text-sm text-gray-500 dark:text-zinc-400">
                Checkout the our{" "}
                <Link href="/privacy" className="underline">
                  privacy policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="underline">
                  terms of service
                </Link>
              </p>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
