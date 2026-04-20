"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { LoginInputType, loginSchema } from "@/validations/auth.validation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
    resolver: zodResolver(loginSchema),
  });
  const { push } = useRouter();
  const onLogin: SubmitHandler<LoginInputType> = async data => {
    try {
      toast.promise<{ status: string }>(
        () =>
          new Promise(resolve =>
            setTimeout(() => {
              resolve({ status: "success" });
            }, 2000),
          ),
        {
          loading: "Loading...",
          success: "Registrasi berhasil",
          error: "Failed to register",
        },
      );
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/dashboard",
      });
      push("/dashboard");
    } catch (error) {
      toast.error("Login failed");
      console.log(error);
    }
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
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Input your email"
                  className={`${errors.email ? "border-2 border-red-500" : ""}`}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              )}
            />
            {errors.email?.message && (
              <FieldError>{errors.email?.message}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Input your password"
                  className={`${errors.password ? "border-2 border-red-500" : ""}`}
                  aria-invalid={errors.password ? "true" : "false"}
                />
              )}
            />
            {errors.password?.message && (
              <FieldError>{errors.password?.message}</FieldError>
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
