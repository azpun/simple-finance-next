"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  RegisterInputType,
  registerSchema,
} from "@/validations/auth.validation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const RegisterForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterInputType>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const onRegister: SubmitHandler<RegisterInputType> = async data => {
    // e.preventDefault();
    // const formData = new FormData(e.currentTarget);
    // const data = Object.fromEntries(formData) as RegisterInputType;
    // const jsonData = JSON.stringify(data);
    // try {
    //   const response = await fetch("/api/auth/register", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json", // WAJIB ada agar backend bisa memproses JSON
    //     },
    //     body: jsonData,
    //   });
    //   if (!response.ok) {
    //     // Menangani error status code (400, 401, 500, dll)
    //     const errorData = await response.json();
    //     console.error("Registrasi gagal:", errorData.message);
    //     return;
    //   }
    //   const result = await response.json();
    //   console.log("Registrasi berhasil:", result);
    //   return result;
    // } catch (error) {
    //   console.log(error);
    // }

    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onRegister)}>
        <FieldGroup className="px-6">
          <Field>
            <FieldLabel htmlFor="fullname">Fullname</FieldLabel>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  id="fullname"
                  name="name"
                  placeholder="Input your fullname"
                  autoComplete="false"
                  className={`${errors.name ? "border-2 border-red-500" : ""}`}
                  aria-invalid={errors.name ? "true" : "false"}
                />
              )}
            />
            {errors.name?.message !== "" && (
              <FieldError>{errors.name?.message}</FieldError>
            )}
          </Field>
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
                  autoComplete="false"
                  className={`${errors.email ? "border-2 border-red-500" : ""}`}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              )}
            />
            {errors.email?.message !== "" && (
              <FieldError>{errors.email?.message}</FieldError>
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
                  message: "Password must greater than equal 6 characters",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Input your password"
                  autoComplete="false"
                  className={`${errors.password ? "border-2 border-red-500" : ""}`}
                  aria-invalid={errors.password ? "true" : "false"}
                />
              )}
            />
            {errors.password?.message !== "" && (
              <FieldError>{errors.password?.message}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <Controller
              control={control}
              name="confirm"
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  id="confirm-password"
                  name="confirm"
                  placeholder="Input your password again"
                  autoComplete="false"
                  className={`${errors.confirm ? "border-2 border-red-500" : ""}`}
                  aria-invalid={errors.confirm ? "true" : "false"}
                />
              )}
            />
            {errors.confirm?.message !== "" && (
              <FieldError>{errors.confirm?.message}</FieldError>
            )}
          </Field>
          <Field className="gap-3">
            <Button type="submit" className="p-5">
              Submit
            </Button>
            <span>
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-green-600 hover:text-lime-500 hover:underline"
              >
                Sign In
              </Link>
            </span>
          </Field>
        </FieldGroup>
      </form>
    </>
  );
};

export default RegisterForm;
