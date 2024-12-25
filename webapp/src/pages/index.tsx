import { useState } from "react";
import { Outlet, NavLink } from "react-router";
import { useTokenStore } from "../stores/store";

function Index() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const tokenStore = useTokenStore();

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <>
      <main className="flex min-h-screen min-w-screen">
        <aside className="hidden w-64 bg-gray-800 md:block min-h-screen">
          <div>
            <div className="py-3 text-2xl uppercase text-center tracking-widest bg-gray-900 border-b-2 border-gray-800 mb-8 h-16">
              <a href="/" className="text-white">
                Tripatra
              </a>
            </div>
            <nav className="text-sm text-gray-300">
              <ul className="flex flex-col">
                <li
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${
                    activeItem === "dashboard" ? "bg-gray-700" : ""
                  }`}
                >
                  <NavLink
                    to="/"
                    className="py-3 w-full flex items-center"
                    onClick={() => handleItemClick("dashboard")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 mr-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                      />
                    </svg>
                    Dashboard
                  </NavLink>
                </li>
                <li className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  USER MANAGEMENT
                </li>
                <li
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${
                    activeItem === "users" ? "bg-gray-700" : ""
                  }`}
                >
                  <NavLink
                    className="py-3 flex items-center"
                    to="/users"
                    onClick={() => handleItemClick("users")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 mr-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                      />
                    </svg>
                    Users
                  </NavLink>
                </li>

                <li className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  PRODUCT MANAGEMENT
                </li>

                <li
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${
                    activeItem === "products" ? "bg-gray-700" : ""
                  }`}
                >
                  <NavLink
                    className="py-3 flex items-center"
                    to="/products"
                    onClick={() => handleItemClick("products")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 mr-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                      />
                    </svg>
                    Products
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        <div className="w-full flex-1">
          <nav className="bg-gray-800 text-white p-4 w-full flex justify-end items-center min-w-screen h-16">
            <button
              type="button"
              className="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => {
                tokenStore.logout();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="128"
                height="128"
                viewBox="0 0 24 24"
                className="w-4 h-4 text-white me-2"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
                />
              </svg>
              Logout
            </button>
          </nav>

          <div className="p-4">
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
}

export default Index;
