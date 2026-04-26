"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center justify-center h-[75vh] md:h-[85vh]">
        <div className="flex flex-col gap-2 p-4">
          <h1 className="text-2xl md:text-center md:text-4xl">
            Handle Your Finances Easily. Effortlessly.
          </h1>
          <p className="text-sm md:text-center text-balance md:text-lg">
            Simplify your finances with intuitive tools, intelligent insights,
            and total control over your spending and saving. Start today.
          </p>
          <div className="flex gap-2 mt-8 md:items-center md:justify-center">
            <Button className="p-5" onClick={() => router.push("/auth/login")}>
              Get Started
            </Button>
            <Button variant="ghost" className="p-5">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col items-center justify-center gap-4 text-center ">
          <div>
            <h2 className="text-xl md:text-center md:text-2xl">Features</h2>
            <p className="text-sm md:text-center text-balance md:text-lg">
              Dalam aplikasi ini terdapat beberapa fitur, diantaranya adalah
            </p>
          </div>
          <div className="grid w-full gap-4 md:px-10 md:grid-cols-3">
            <Card className="p-5 md:mx-0 md:p-10">
              <h3 className="text-lg md:text-xl">Smart Transaction Tracking</h3>
              <p>
                Pencatatan pengeluaran dan pemasukan dengan detail judul,
                nominal, dan tanggal otomatis.
              </p>
            </Card>
            <Card className="p-5 md:mx-0 md:p-10">
              <h3 className="text-lg md:text-xl">Category Management</h3>
              <p>
                Pengelompokan transaksi berdasarkan kategori (seperti Makanan,
                Transportasi, Hiburan) untuk melihat ke mana uang Anda pergi.
              </p>
            </Card>
            <Card className="p-5 md:mx-0 md:p-10">
              <h3 className="text-lg md:text-xl">
                Income vs Expense Analytics
              </h3>
              <p>
                Visualisasi perbandingan antara pemasukan (INCOME) dan
                pengeluaran (EXPENSE) secara real-time.
              </p>
            </Card>
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col items-center justify-center text-center border">
          <h2>About</h2>
          <p>
            Ini adalah aplikasi yang dibuat oleh Punari dengan tujuan untuk
            mempermudah pengelolaan keuangan pribadi
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center text-center border">
        <div>
          <h2>Contact</h2>
          <p>
            Jika Anda memiliki pertanyaan, saran, atau masalah, silakan hubungi
            kami melalui email
          </p>
        </div>
      </div>
    </div>
  );
}
