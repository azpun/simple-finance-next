"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { LoginInputType } from "@/validations/auth.validation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

const LoginForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginInputType>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onLogin: SubmitHandler<LoginInputType> = async data => {
    console.log(data);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onLogin)}>
        <FieldGroup className="px-6">
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is Required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="g6oZK@example.com"
                  className={`${errors.email ? "border-2 border-red-500" : ""}`}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              )}
            />
            {errors.email?.message && (
              <small className="text-red-500">{errors.email.message}</small>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is Required",
                minLength: {
                  value: 6,
                  message: "Password must greater then equal 6 characters",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="********"
                  className={`${errors.password ? "border-2 border-red-500" : ""}`}
                  aria-invalid={errors.password ? "true" : "false"}
                />
              )}
            />
            {errors.password?.message && (
              <small className="text-red-500">{errors.password.message}</small>
            )}
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
