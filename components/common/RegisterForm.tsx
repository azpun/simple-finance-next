"use client";
import { Link } from "lucide-react";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { RegisterInputType } from "@/validations/auth.validation";

const RegisterForm = () => {
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as RegisterInputType;
    const jsonData = JSON.stringify(data);

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
      return result;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <form onSubmit={handleRegister}>
        <FieldGroup className="px-6">
          <Field>
            <FieldLabel htmlFor="fullname">Fullname</FieldLabel>
            <Input
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
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
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
    </>
  );
};

export default RegisterForm;
