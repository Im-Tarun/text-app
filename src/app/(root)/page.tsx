"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Dot, Mail } from "lucide-react"
import messages from "@/messages.json"
import React from "react"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )
  return (
    <>
    <main className="flex-grow flex flex-col bg-[#ebebeb] items-center justify-center px-4 md:px-24 py-12 dark:bg-gray-800 dark:text-white h-[90vh]">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Anno Text - Where your identity remains a secret.
          </p>
          <Link href={"/user/main_user"} className="underline py-1" target="_blank">Test by texting main_user </Link>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

      <footer className="text-center p-2 md:p-4 bg-[#c6c6c6] dark:bg-gray-900 dark:text-white fixed bottom-0 w-full">
        <div>© 2025 Anno Text. All rights reserved.</div>
        <div className="flex items-center justify-center">
          <Button variant={"link"} className="h-1" asChild><Link href={"linkedin.com/in/tarun-yaduwanshi"}> Tarun Yaduwanshi </Link></Button>
          <Dot className="text-black"/>
          <Button variant={"link"} className="h-1" asChild><Link href={"https://github.com/Im-Tarun"}> Github </Link></Button>
        </div>
      </footer>
    </>
  );
}
