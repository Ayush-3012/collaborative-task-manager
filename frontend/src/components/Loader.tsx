import { useEffect } from "react";
import { ring } from "ldrs";

type LoaderProps = {
  fullScreen?: boolean;
  label?: string;
};

const Loader = ({ fullScreen = true, label }: LoaderProps) => {
  useEffect(() => {
    ring.register();
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullScreen ? "min-h-screen" : "h-full"
      }`}
    >
      <l-ring
        size="42"
        stroke="4"
        bg-opacity="0"
        speed="1.8"
        color="#4f46e5" // indigo-600
      />

      {label && (
        <p className="text-sm text-slate-500 animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
};

export default Loader;
