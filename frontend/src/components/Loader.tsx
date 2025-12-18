import { useEffect } from "react";
import { ring } from "ldrs";

const Loader = ({ fullScreen = true }) => {
  useEffect(() => {
    ring.register();
  }, []);

  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen" : "h-full"
      }`}
    >
      <l-ring
        size="40"
        stroke="5"
        bg-opacity="0"
        speed="2"
        color="#2563eb"
      ></l-ring>
    </div>
  );
};

export default Loader;
