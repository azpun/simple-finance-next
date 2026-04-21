export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center justify-center border h-[75vh] md:h-[85vh]">
        <h1>Simple Finance Tracker</h1>
      </div>
      <div>
        <div className="flex flex-col items-center justify-center text-center border">
          <h2>Features</h2>
          <p>Dalam aplikasi ini terdapat beberapa fitur, diantaranya adalah</p>
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
