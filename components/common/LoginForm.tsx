"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { LoginInputType } from "@/validations/auth.validation";
import { SubmitHandler, useForm } from "react-hook-form";

const LoginForm = () => {
  const { handleSubmit, register } = useForm<LoginInputType>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onLogin: SubmitHandler<LoginInputType> = async () => {};
  return (
    <>
      <form onSubmit={handleSubmit(onLogin)}>
        <FieldGroup className="px-6">
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              {...register("email")}
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
              {...register("password")}
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
                className="text-green-600 hover:text-lime-500 hover:underline"
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
