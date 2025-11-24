"use client";
import { Card, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navbar";
import { Compass } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Signup() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen  text-center justify-center p-4 ">
        <div className="text-center mt-12 ">
          <h2 className="text-2xl font-bold flex text-center justify-center tracking-tight">
            Signup to <Compass className="w-6 h-6" /> Cashcompass
          </h2>
          <p className="text-muted-foreground">
            Track your spending by creating an account
          </p>
        </div>

        <Card>
          <CardTitle>Hello</CardTitle>
          <form action="">
            <div className="flex">
              <label htmlFor=""> Firstname</label>
              <Input placeholder="Enter your Firstname" className="w-36" />
            </div>
            <div className="flex">
              <label htmlFor="">Lastname</label>
              <Input placeholder="Enter your Name" className="w-36" />
            </div>

            <div className="flex">
              <label htmlFor="">Email</label>
              <Input placeholder="Enter your Email" className="w-36" />
            </div>
            <div className="flex">
              <label htmlFor="">Phone number</label>
              <Input placeholder="Enter your phone number" className="w-36" />
            </div>
            <div className="flex">
              <label htmlFor="">Password</label>
              <Input placeholder="Enter your Password" className="w-36" />
            </div>
            <div className="flex">
              <label htmlFor="">Confirm Password</label>
              <Input placeholder="Confirm password" className="w-36" />
            </div>
          </form>
          <Button className="w-16 justify-center">Signup</Button>
        </Card>

        <p>
          Already have an account? <Link href="/auth/signin"> Signin</Link>
        </p>
      </div>
    </>
  );
}
