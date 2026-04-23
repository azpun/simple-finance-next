// "use client";
import { PlusIcon } from "lucide-react";

const FloatingActionButton = () => {
  return (
    <div className="fixed bottom-10 right-10 md:hidden">
      <button
        type="button"
        className="p-4 font-bold text-white rounded-full bg-primary hover:bg-primary/80"
      >
        <PlusIcon />
      </button>
    </div>
  );
};

export default FloatingActionButton;
