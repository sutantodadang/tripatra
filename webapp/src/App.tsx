import { Route, Routes } from "react-router";
import Index from "./pages";
import Home from "./pages/dashboard/home";
import User from "./pages/dashboard/user";
import Product from "./pages/dashboard/product";
import Login from "./pages/login";
import Register from "./pages/register";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <>
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<User />} />
            <Route path="/products" element={<Product />} />
          </Route>

          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}

export default App;
