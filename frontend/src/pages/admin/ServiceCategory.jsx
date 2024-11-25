import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaPlus } from "react-icons/fa";
import Sidebar from "../../components/AdminComponents/Sidebar";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../features/admin/adminSlice";

// Ensure Modal is accessible
Modal.setAppElement("#root");

// Validation schema using Yup
const CategorySchema = Yup.object().shape({
  name: Yup.string().required("Category Name is required"),
  image: Yup.string()
    .url("Must be a valid URL")
    .required("Image URL is required"),
  isSubcategory: Yup.boolean(),
  parentCategory: Yup.string().when("isSubcategory", {
    is: true,
    then: Yup.string().required("Parent Category is required"),
  }),
});

function ServiceCategories() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const dispatch = useDispatch();

  // Fetching categories from Redux store
  const categories = useSelector((state) => state.admin.categories);
  console.log(categories,);
  
  const status = useSelector((state) => state.admin.status);

  // Pagination Logic
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (category = null) => {
    setEditingCategory(category);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (values, { resetForm }) => {
    if (editingCategory) {
      // Dispatch updateCategory action
      // dispatch(updateCategory({ id: editingCategory.id, ...values }));
    } else {
      const newCategory = {
        ...values,
      };
      dispatch(addCategory(newCategory));
    }
    closeModal();
    resetForm();
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Service Categories</h1>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            <FaPlus className="inline mr-2" /> Add New Category
          </button>
        </div>

        {status === "loading" ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-xl text-gray-600">Loading categories...</p>
          </div>
        ) : Array.isArray(categories) && categories.length > 0 ? (
          <div>
            {/* Grid of Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedCategories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    onError={(e) => (e.target.src = "https://via.placeholder.com/150")} // Fallback image on error
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {category.name}
                    </h2>
                    <div className="mt-4 flex justify-between items-center">
                      <Link
                        to={`/admin/category_services/${category.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        View Services
                      </Link>
                      <button
                        onClick={() => openModal(category)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit /> Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  className={`px-4 py-2 rounded ${
                    currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-gray-200 rounded">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-600">No categories available</p>
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Category Modal"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto shadow-lg">
          <h2 className="text-xl font-bold mb-4">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h2>
          <Formik
            initialValues={{
              name: editingCategory?.name || "",
              isSubcategory: false,
              parentCategory: "",
              image:
                editingCategory?.image || "https://via.placeholder.com/150",
            }}
            validationSchema={CategorySchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Category Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter category name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <Field
                      type="checkbox"
                      name="isSubcategory"
                      className="mr-2"
                      checked={values.isSubcategory}
                      onChange={(e) => {
                        setFieldValue("isSubcategory", e.target.checked);
                        if (!e.target.checked) {
                          setFieldValue("parentCategory", "");
                        }
                      }}
                    />
                    Is this a subcategory?
                  </label>
                </div>

                {values.isSubcategory && (
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Select Parent Category
                    </label>
                    <Field
                      as="select"
                      name="parentCategory"
                      className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Parent Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="parentCategory"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <Field
                    type="text"
                    name="image"
                    className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter image URL"
                  />
                  <ErrorMessage
                    name="image"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg mr-2 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    {editingCategory ? "Update Category" : "Add Category"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </div>
  );
}

export default ServiceCategories;
