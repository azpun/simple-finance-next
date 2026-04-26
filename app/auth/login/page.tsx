import LoginForm from "@/components/common/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Login() {
  return (
    <div className="sm:flex sm:justify-center sm:items-center">
      <Card className="my-8 sm:w-md">
        <CardHeader className="my-2">
          <div>
            <Link href="/">
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </div>
          <CardTitle className="flex items-center justify-center">
            <h1 className="text-2xl">Sign In</h1>
          </CardTitle>
          <CardDescription className="flex items-center justify-center">
            Enter your data below
          </CardDescription>
        </CardHeader>
        <CardContent className="my-4">
          <LoginForm />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
