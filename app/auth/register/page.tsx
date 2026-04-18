/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
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
import {
  RegisterInputType,
  validateRegister,
} from "@/validations/auth.validation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FormEvent } from "react";

export default function Register() {
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as RegisterInputType;
    const jsonData = JSON.stringify(data);
    // const validated = validateRegister(JSON.parse(jsonData));
    // console.log(JSON.parse(jsonData));

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // WAJIB ada agar backend bisa memproses JSON
        },
        body: jsonData,
      });
      if (!response.ok) {
        // Menangani error status code (400, 401, 500, dll)
        const errorData = await response.json();
        console.error("Registrasi gagal:", errorData.message);
        return;
      }
      const result = await response.json();
      console.log("Registrasi berhasil:", result);
    } catch (error) {
      console.log(error);
    }
  };
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
            <h1 className="text-2xl">Sign Up</h1>
          </CardTitle>
          <CardDescription className="flex justify-center items-center">
            Enter your data below
          </CardDescription>
        </CardHeader>
        <CardContent className="my-4">
          <form onSubmit={handleRegister}>
            <FieldGroup className="px-6">
              <Field>
                <FieldLabel htmlFor="fullname">Fullname</FieldLabel>
                <Input
                  type="text"
                  id="fullname"
                  name="fullname"
                  placeholder="John Doe"
                  required
                />
              </Field>
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
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input
                  type="password"
                  id="confirm-password"
                  name="confirm"
                  placeholder="********"
                  required
                />
              </Field>
              <Field className="gap-3">
                <Button type="submit" className="p-5">
                  Submit
                </Button>
                <span>
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="hover:text-green-500 hover:underline"
                  >
                    Sign In
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
