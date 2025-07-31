"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {  useRouter } from "next/navigation";
import signInSchema from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const signInPage = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const response = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
      if (response.error) {
        toast.error("Login failed", {
          description: "Incorrect username or password",
        });
      }
      router.replace("/dashboard");
      
      if (response.url) {
        toast.success("Success", {
          description: "Signed In successfully",
        });
      }
    } catch (error) {
      console.error("Error Signing In", error);
      toast.error("Error", {
        description: "Some Error occurd",
      });
    }
  };

  const handleGooleAuth = async () => {
    try {
      // await signIn("google", {
      //   redirectTo: "/dashboard",
      // });

      toast.warning("Not compeleted", {
        description: "We are working on it",
      });
    } catch (error) {
      console.error("some error occurred", error)
      toast.success("Error", {
        description: "Unexpected Error occurred in server",
      });
    }
  };

  return (
    <div className="bg-[#ebebeb] dark:bg-[#1e2939] flex justify-center items-center min-h-screen ">
      <Card className="w-full max-w-sm gap-4">
        <CardHeader>
          <CardTitle className="text-2xl my-0">Login</CardTitle>
          <CardDescription>
            Enter your detail to login to your account
          </CardDescription>
          <CardAction>
            <Button asChild variant={"link"}>
              <Link href={"/sign-up"}>Sign Up</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="flex gap-2 flex-col"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Username or Email</FormLabel>
                    <FormControl>
                      <Input  placeholder="username/email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-6" type="submit">
                LogIn
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGooleAuth}
          >
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default signInPage;
