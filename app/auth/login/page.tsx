import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Login() {
  return (
    <div className="sm:flex sm:justify-center sm:items-center">
      <Card className="my-8 w-full sm:w-md ">
        <CardHeader className="my-2">
          <div>
            <Link href="/">
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </div>
          <CardTitle className="flex justify-center items-center">
            <h1 className="text-2xl">Sign In</h1>
          </CardTitle>
          <CardDescription className="flex justify-center items-center">
            Enter your data below
          </CardDescription>
        </CardHeader>
        <CardContent className="my-4">
          <form action="submit">
            <FieldGroup className="px-6">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="g6oZK@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="********"
                  required
                />
              </Field>

              <Field className="gap-3">
                <Button type="submit" className="p-5">
                  Submit
                </Button>
                <span>
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="hover:text-green-500 hover:underline"
                  >
                    Sign Up
                  </Link>
                </span>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
