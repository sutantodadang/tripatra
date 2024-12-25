import { useMutation, useQuery } from "@apollo/client";
import { TableColumn } from "react-data-table-component";

import DataTable from "../../components/DataTable";
import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  GET_ALL_PRODUCTS,
  UPDATE_PRODUCT,
} from "../../graph/query";
import ModalInput from "../../components/ModalInput";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface DataRow {
  product_id: string;
  product_name: string;
  product_price: number;
  product_stock: number;
}

function Product() {
  const { loading, data } = useQuery(GET_ALL_PRODUCTS);

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [{ query: GET_ALL_PRODUCTS }],
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: GET_ALL_PRODUCTS }],
  });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: GET_ALL_PRODUCTS }],
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [productName, setProductName] = useState<string>("");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productStock, setProductStock] = useState<number>(0);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<DataRow | null>(null);

  const columns: TableColumn<DataRow>[] = [
    {
      name: "ID",
      selector: (row) => row.product_id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.product_name,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.product_price,
      sortable: true,
    },
    {
      name: "Stock",
      selector: (row) => row.product_stock,
      sortable: true,
    },
    {
      name: "Action",
      button: "true" as any,
      style: {
        marginRight: "75px",
      },
      cell: (row) => (
        <div className="flex gap-2 justify-center items-center">
          <button
            type="button"
            className="h-10 w-24 text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 text-sm font-medium rounded-lg px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
            onClick={(e) => {
              e.preventDefault();
              setShowModal(!showModal);
              setIsDeleteMode(false);
              setIsEditMode(true);

              setProductName(row.product_name);
              setProductPrice(row.product_price);
              setProductStock(row.product_stock);
              setSelectedProduct(row);
            }}
          >
            <svg
              className="w-3.5 h-3.5 me-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 21"
            >
              <path d="M 18.414062 2 C 18.158062 2 17.902031 2.0979687 17.707031 2.2929688 L 15.707031 4.2929688 L 14.292969 5.7070312 L 3 17 L 3 21 L 7 21 L 21.707031 6.2929688 C 22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062 L 19.121094 2.2929688 C 18.926094 2.0979687 18.670063 2 18.414062 2 z M 18.414062 4.4140625 L 19.585938 5.5859375 L 18.292969 6.8789062 L 17.121094 5.7070312 L 18.414062 4.4140625 z M 15.707031 7.1210938 L 16.878906 8.2929688 L 6.171875 19 L 5 19 L 5 17.828125 L 15.707031 7.1210938 z"></path>
            </svg>
            Edit
          </button>
          <button
            type="button"
            className="h-10 w-24 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 text-sm font-medium rounded-lg px-4 py-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            onClick={(e) => {
              e.preventDefault();
              setShowModal(!showModal);
              setIsDeleteMode(true);
              setIsEditMode(false);
              setSelectedProduct(row);
            }}
          >
            <svg
              className="w-3.5 h-3.5 me-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 21"
            >
              <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
            </svg>
            Delete
          </button>
        </div>
      ),
    },
  ];

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data } = await createProduct({
        variables: {
          input: {
            product_name: productName,
            product_price: productPrice,
            product_stock: productStock,
          },
        },
      });

      if (data.createProduct) {
        toast.success("Product added successfully!");
        // Reset form fields
        setProductName("");
        setProductPrice(0);
        setProductStock(0);
        setShowModal(false);
        // Optionally, refetch or update the user list
      }
    } catch (error: any) {
      toast.error(`Error adding user: ${error.message}`);
    }
  }

  async function handleEditProduct() {
    try {
      const { data } = await updateProduct({
        variables: {
          id: selectedProduct?.product_id,
          input: {
            product_name: productName,
            product_price: productPrice,
            product_stock: productStock,
          },
        },
      });

      if (data) {
        toast.success("Product updated successfully!");
        setShowModal(false);
        setSelectedProduct(null);
        setIsEditMode(false);
      }
    } catch (error: any) {
      toast.error(`Error updating user: ${error.message}`);
    }
  }

  async function handleDeleteProduct() {
    try {
      const { data } = await deleteProduct({
        variables: {
          id: selectedProduct?.product_id,
        },
      });

      if (data) {
        toast.success("Product deleted successfully!");
        setIsDeleteMode(false);
        setSelectedProduct(null);
        setShowModal(false);
      }
    } catch (error: any) {
      toast.error(`Error deleting user: ${error.message}`);
    }
  }

  function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEditMode) {
      handleEditProduct();
    } else if (isDeleteMode) {
      handleDeleteProduct();
    } else {
      handleAddProduct(e);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <>
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
      <div className="w-full px-10 py-5">
        <DataTable
          data={data?.products || []}
          columns={columns}
          title="Product Management"
          titleButton="Add Product"
          onClick={(e: any) => {
            e.preventDefault();
            setProductName("");
            setProductPrice(0);
            setProductStock(0);
            setIsEditMode(false);
            setIsDeleteMode(false);
            setSelectedProduct(null);

            setShowModal(!showModal);
          }}
        />
      </div>

      <ModalInput
        showModal={showModal}
        setShowModal={setShowModal}
        title={
          isEditMode
            ? "Edit Product"
            : isDeleteMode
            ? "Delete Product"
            : "Add Product"
        }
      >
        <form className="p-4 md:p-5" onSubmit={handleModalSubmit}>
          {isDeleteMode ? (
            <p>Apakah anda yakin menghapus data?</p>
          ) : (
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product name"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product price"
                  required
                  value={productPrice}
                  onChange={(e) => setProductPrice(Number(e.target.value))}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="stock"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product stock"
                  required
                  value={productStock}
                  onChange={(e) => setProductStock(Number(e.target.value))}
                />
              </div>
            </div>
          )}
          <button
            type="submit"
            className={`text-white inline-flex items-center focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
              isDeleteMode
                ? "bg-red-700 hover:bg-red-800 focus:ring-red-300"
                : isEditMode
                ? "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-300"
                : "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300"
            } dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
          >
            {isEditMode ? (
              <>
                <svg
                  className="w-3.5 h-3.5 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 21"
                >
                  <path d="M 18.414062 2 C 18.158062 2 17.902031 2.0979687 17.707031 2.2929688 L 15.707031 4.2929688 L 14.292969 5.7070312 L 3 17 L 3 21 L 7 21 L 21.707031 6.2929688 C 22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062 L 19.121094 2.2929688 C 18.926094 2.0979687 18.670063 2 18.414062 2 z M 18.414062 4.4140625 L 19.585938 5.5859375 L 18.292969 6.8789062 L 17.121094 5.7070312 L 18.414062 4.4140625 z M 15.707031 7.1210938 L 16.878906 8.2929688 L 6.171875 19 L 5 19 L 5 17.828125 L 15.707031 7.1210938 z"></path>
                </svg>
                Update Product
              </>
            ) : isDeleteMode ? (
              <>
                <svg
                  className="w-3.5 h-3.5 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 21"
                >
                  <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
                </svg>
                Delete Product
              </>
            ) : (
              <>
                <svg
                  className="me-1 -ms-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Add Product
              </>
            )}
          </button>
        </form>
      </ModalInput>
    </>
  );
}

export default Product;
