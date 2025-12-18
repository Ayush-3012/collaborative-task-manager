import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-4xl font-bold mb-4">Task Manager</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Manage your tasks efficiently. Login to create, assign and track tasks
        in one place.
      </p>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
