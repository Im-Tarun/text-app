"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import signUpSchema from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { apiResponse } from "@/types/apiResponse";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const signUp = () => {
  const [username, setUsername] = useState<string>("");
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const setDebounceUsername = useDebounceCallback(setUsername, 600);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    (async function checkUsernameUnique() {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get<apiResponse>(
            `/api/unique-username?username=${username}`
          );
          setUsernameMessage(response.data?.message);
        } catch (error) {
          let axiosError = error as AxiosError<apiResponse>;
          setUsernameMessage(
            (axiosError.response?.data?.message as string) ??
              "Error checking username"
          );
          console.error(axiosError);
        } finally {
          setIsCheckingUsername(false);
        }
      }
    })();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<apiResponse>("/api/sign-up", data);
      router.replace(`/verify-account/${username}`);

      toast.success("Success", {
        description: response.data?.message,
      });
    } catch (error) {
      console.error("Error in sign up", error);
      let axiosError = error as AxiosError<apiResponse>;
      toast.error("Sign up failed", {
        description: axiosError.response?.data?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#ebebeb] flex justify-center items-center min-h-screen  dark:bg-[#1e2939]  dark:text-black">
      <div className="w-full max-w-96 p-8 space-y-8  bg-white dark:bg-[#101828] dark:text-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="capitalize text-3xl font-extrabold tracking-tight lg:text-4xl mb-6 ">
            join text-app
          </h1>
          <p className="mb-4">Sign Up to start the journey with us.</p>
        </div>
        <Form {...form}>
          <form
            className="flex gap-2 flex-col "
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      className="border-2"
                      placeholder="username"
                      autoComplete="off"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setDebounceUsername(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <>
                      <LoaderCircle className="absolute animate-spin right-3 top-[28px] " />
                    </>
                  )}
                  <p
                    className={`absolute bottom-[-20px] right-1 text-[small] ${
                      usernameMessage === "Username is unique"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {usernameMessage}{" "}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                    autoComplete="off"
                      className="border-2"
                      type="email"
                      placeholder="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem  className="relative">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      className="border-2"
                      type={showPassword ? "text" : "password"}
                      placeholder="password"
                      {...field}
                    />
                  </FormControl>
                    <div
                      className="absolute right-3 top-7  dark:text-gray-300 text-gray-600"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? <Eye /> : <EyeOff />}{" "}
                    </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-6" type="submit">
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default signUp;
