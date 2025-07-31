"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { apiResponse } from "@/types/apiResponse";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import z from "zod";
import verifyCodeSchema from "@/schemas/verificationSchema";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

const verifyAccount = () => {
    const params = useParams<{username: string}>();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      otp : ''
    },
  });

    const onSubmit = async (data: z.infer<typeof verifyCodeSchema>) =>{
      setIsSubmitting(true)
      try {
        const response = await axios.post("/api/account-verification", {
          username : params.username,
          verifyCode: data.otp
        })
        router.replace("/dasboard")

        toast.success("Account verified successfully",{
          description: response.data?.message
        })
        
      } catch (error) {
        console.error("Error verifing account", error )
        const axiosError = error as AxiosError<apiResponse>
        toast.error("Error",{
          description: axiosError.response?.data?.message
        })
      }finally{
        setIsSubmitting(false);
      }
    } 


  return (
    <div className="bg-gray-100 flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="capitalize text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 ">
            join text-app
          </h1>
          <p className="mb-4">Verify Your Account</p>
        </div>
        <Form {...form}>
          <form className="flex gap-2 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
            
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter verification Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter OTP"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-6" type="submit">
                {
                    isSubmitting  ? (
                        <LoaderCircle className="animate-spin"/>
                    ) : ('Verify')
                }
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default verifyAccount
