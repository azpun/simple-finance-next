"use client";
import { Link } from "lucide-react";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
// import { RegisterInputType } from "@/validations/auth.validation";

const LoginForm = () => {
  //   const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     // const formData = new FormData(e.currentTarget);
  //     // const data = Object.fromEntries(formData) as RegisterInputType;
  //     // const jsonData = JSON.stringify(data);
  //   };
  return (
    <>
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
    </>
  );
};

export default LoginForm;
