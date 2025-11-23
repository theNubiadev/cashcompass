"use client";
import { Card, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navbar";
import { Wallet, Compass } from "lucide-react";
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
                  </Card>
      </div>
    </>
  );
}
