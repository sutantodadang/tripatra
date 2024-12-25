import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../graph/query";
import { useNavigate, NavLink } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useTokenStore } from "../stores/store";

const schema = z.object({
  email: z.string().email("Invalid email format").nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

type FormData = z.infer<typeof schema>;

function Login() {
  const navigate = useNavigate();
  const tokenStore = useTokenStore();
  const [loginUser, { loading }] = useMutation(LOGIN_USER);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await loginUser({
        variables: { input: data },
      });

      if (response.data.loginUser.token) {
        toast.success("Login successful!");
        tokenStore.setToken(response.data.loginUser.token);
        reset();
        navigate("/");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed!");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <section className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              id="email"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              placeholder="you@example.com"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              id="password"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              placeholder="•••••••••"
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col items-center justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 
                         font-medium rounded-lg text-sm px-5 py-2.5 mb-2 
                         dark:bg-blue-600 dark:hover:bg-blue-700 
                         focus:outline-none dark:focus:ring-blue-800 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <NavLink
              to="/register"
              className="text-blue-700 hover:underline dark:text-blue-300 dark:hover:underline"
            >
              Don't have an account? Register here
            </NavLink>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Login;
