"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { RegisterInputType } from "@/validations/auth.validation";
import { SubmitHandler, useForm } from "react-hook-form";

const RegisterForm = () => {
  const { handleSubmit, register } = useForm<RegisterInputType>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
    },
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
            <Input
              {...register("name")}
              type="text"
              id="fullname"
              name="name"
              placeholder="John Doe"
              required
            />
          </Field>
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
          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <Input
              {...register("confirm")}
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
