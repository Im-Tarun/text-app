"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import messageSchema from '@/schemas/messageSchema'
import { apiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const page = () => {
  const params = useParams()
  const [suggestions, setSuggestions] = useState(["loading...","loading..","loading..."])

  const form = useForm<z.infer<typeof messageSchema>>({
      resolver: zodResolver(messageSchema),
      defaultValues: {
        content: ""
      },
    });

  const { setValue } = form;
  
  const getAISuggestions = async()=>{
    toast("Loading new A.I messages")
    try {
      const response = await axios.get('/api/suggest-ai-msg')
      let AImessage = response.data?.message
      setSuggestions(AImessage.split('||'));
      toast.success("success",{
        description: "New A.I Suggested Messages "
      })
      
    } catch (error) {
      console.log(error)
      toast.error("Error getting A.I Message Suggestions")
    }
  }

  useEffect(() => {
    getAISuggestions()
   
  }, [])
  

  const onSubmit = async (data : z.infer<typeof messageSchema>)=>{
    toast(`Sending message to ${params.username}`)
    try {
      setValue("content","")
      const response = await axios.post("/api/send-message",{
        username: params.username,
        content: data.content,
      }) 
      toast.success("Done",{
        description: response.data.message
      })
    } catch (error) {
      setValue("content","")
      console.log(error)
      const exiosError = error as AxiosError<apiResponse>
      toast.error("Sorry",{
        description: exiosError?.response?.data.message 
      })
    }
  }

    

  return (
    <>
      
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 pb-5 pt-14 dark:bg-gray-800 dark:text-white ">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Welcome To A Public Profile;
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>
        <section className='mb-4'>
          <span className='text-sm font-bold capitalize'></span>
          <Form {...form}  >
            <form 
              className="flex gap-2 flex-col items-center"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel className=' font-bold capitalize' > Send Anonymous Message to {params.username}</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the message" className='w-[60vw] h-14 border-2' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <Button type='submit'>Send</Button>
               </form>
              </Form>

          {/* <div className='flex items-center justify-center flex-col gap-5  '>
            <Input onChange={(e)=>setSearchValue(e.target.value)} value={searchValue} className='w-[60vw] h-14 border-3'/>
            <Button>Send</Button>
          </div> */}
        </section>
        <Separator />
        <section className='my-10 w-full m-4 '>
          <Button className='block mb-4' onClick={()=>getAISuggestions()} >Suggest Messages</Button>
          <span className=' font-semibold '>Click on Any Message below to select </span>
          <div className='flex flex-col gap-5 border-2 my-5 p-5 dark:bg-[#101828] rounded-sm'>
            <h2 className='text-xl font-bold '>Messages</h2>
            {
              suggestions.map((elem, ind) => <p key={ind} onClick={()=> setValue("content" ,elem)} className='border-2 cursor-pointer text-center py-3 rounded-sm capitalize'>{elem}</p>)
            }
          </div>
        </section>
        
      </main>
    </>
  )
}

export default page
