import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function NotFound() {
  return (
    <>
      
      <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-8" />
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-center max-w-md">
          Oops! The page you&apos;re looking for doesn&apos;t exist. It might
          have been moved or deleted.
        </p>

        <Button className="mt-8">
          <Link href="/">Return Back Home </Link>
        </Button>
      </div>
    </>
  );
}
