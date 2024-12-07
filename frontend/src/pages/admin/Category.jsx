/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminComponents/Sidebar";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
  addCategory,
  deleteCategory,
  editCategory,
} from "../../features/admin/adminSlice";
import { toast, Toaster } from "sonner";
import { fetchCategories, fetchDepartments } from "../../services/adminService";
// import { getCategories } from "../../api/endpoints/category";

// Set the modal's root element
Modal.setAppElement("#root");

// Validation schema for the category form
const CategorySchema = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
  department: Yup.string().required("Please select a department"),
});

function Category() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // State for currently selected category
  const [departments, setDepartments] = useState([]); // State to store departments
  const [categories, setCategories] = useState([]); // State to store categories
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const itemsPerPage = 6; // Items per page for pagination
  const dispatch = useDispatch();

  // Modal open/close functions
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const openEditModal = (category) => {
    setSelectedCategory(category); // Set the current category to edit
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => setEditModalIsOpen(false);

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => setDeleteModalIsOpen(false);

  // Fetch departments when the component mounts
  const loadDepartments = async () => {
    try {
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (error) {
      toast.error("Error fetching departments");
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // Fetch categories
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Handle adding a new category
  // const handleSubmit = async (values, { resetForm }) => {
  //   try {
  //     await dispatch(addCategory(values)).unwrap();
  //     toast.success("Category added successfully");
  //     closeModal();
  //     resetForm();
  //     loadCategories(); // Refresh categories
  //   } catch (error) {
  //     console.error("Error adding category:", error);
  //     toast.error("Failed to add category");
  //   }
  // };

  // const handleSubmit = async (values, { resetForm }) => {
  //   try {
  //     const newCategory = await dispatch(addCategory(values)).unwrap();
  //     setCategories((prevCategories) => [...prevCategories, newCategory]);
  //     toast.success("Category added successfully");
  //     closeModal();
  //     resetForm();
  //   } catch (error) {
  //     console.error("Error adding category:", error);
  //     toast.error("Failed to add category");
  //   }
  // };
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const newCategory = await dispatch(addCategory(values)).unwrap();
      console.log(newCategory,'response from server');
      
      // If the department details are not included in the response, populate them manually
      const populatedCategory = {
        ...newCategory,
        department: departments.find((dept) => dept._id === values.department),
      };
      setCategories((prevCategories) => [...prevCategories, populatedCategory]);
      toast.success("Category added successfully");
      closeModal();
      resetForm();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    }
  };
  
  

  // // Handle editing a category
  // const handleEditSubmit = async (values) => {
  //   try {
  //     await dispatch(
  //       editCategory({ id: selectedCategory._id, ...values })
  //     ).unwrap();
  //     toast.success("Category updated successfully");
  //     closeEditModal();
  //     loadCategories(); // Refresh categories
  //   } catch (error) {
  //     console.error("Error updating category:", error);
  //     toast.error("Failed to update category");
  //   }
  // };

  // const handleEditSubmit = async (values) => {
  //   try {
  //     const updatedCategory = await dispatch(
  //       editCategory({ id: selectedCategory._id, ...values })
  //     ).unwrap();
  //     setCategories((prevCategories) =>
  //       prevCategories.map((category) =>
  //         category._id === updatedCategory._id ? updatedCategory : category
  //       )
  //     );
  //     toast.success("Category updated successfully");
  //     closeEditModal();
  //   } catch (error) {
  //     console.error("Error updating category:", error);
  //     toast.error("Failed to update category");
  //   }
  // };


  const handleEditSubmit = async (values) => {
    try {
      const updatedCategory = await dispatch(
        editCategory({ id: selectedCategory._id, ...values })
      ).unwrap();
      console.log(updatedCategory,'edited response from server');

      // Ensure the department is populated correctly
      const populatedCategory = {
        ...updatedCategory,
        department: departments.find((dept) => dept._id === values.department),
      };
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === populatedCategory._id ? populatedCategory : category
        )
      );
      toast.success("Category updated successfully");
      closeEditModal();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };
  

  // // Handle deleting a category
  // const handleDelete = async () => {
  //   try {
  //     await dispatch(deleteCategory(selectedCategory._id)).unwrap();
  //     toast.success("Category deleted successfully");
  //     closeDeleteModal();
  //     loadCategories(); 
  //   } catch (error) {
  //     console.error("Error deleting category:", error);
  //     toast.error("Failed to delete category");
  //   }
  // };

  const handleDelete = async () => {
    try {
      await dispatch(deleteCategory(selectedCategory._id)).unwrap();
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== selectedCategory._id)
      );
      toast.success("Category deleted successfully");
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };
  



  // Pagination logic
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Categories</h1>
        <p className="text-lg text-gray-600 mb-10">
          Manage all the categories available for services. You can add, edit,
          or remove categories from this page.
        </p>

        {/* Add Category Button */}
        <button
          onClick={openModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mb-6 transition-all duration-200"
        >
          Add Category
        </button>

        {/* Category List */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Category List</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCategories.length === 0 ? (
              <p className="text-gray-500">No categories available.</p>
            ) : (
              paginatedCategories.map((category) => (
                <div
                  key={category._id}
                  className="border p-4 rounded-lg shadow-sm hover:shadow-md"
                >
                  <h3 className="text-xl font-semibold text-gray-800">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Department: {category.department?.name || "N/A"}
                  </p>
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => openEditModal(category)}
                      className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(category)}
                      className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
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
      </div>

      {/* Modals for Adding, Editing, and Deleting */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Category"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Add New Category</h2>
          <Formik
            initialValues={{ name: "", department: "" }}
            validationSchema={CategorySchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
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
                    Department
                  </label>
                  <Field
                    as="select"
                    name="department"
                    className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" label="Select department" />
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="department"
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding..." : "Add Category"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>

      {selectedCategory && (
        <Modal
          isOpen={editModalIsOpen}
          onRequestClose={closeEditModal}
          contentLabel="Edit Category"
          className="fixed inset-0 flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Category</h2>
            <Formik
              initialValues={{
                name: selectedCategory.name,
                department: selectedCategory.department._id,
              }}
              validationSchema={CategorySchema}
              onSubmit={handleEditSubmit}
            >
              {({ isSubmitting }) => (
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
                      Department
                    </label>
                    <Field
                      as="select"
                      name="department"
                      className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="" label="Select department" />
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="department"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg mr-2 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Modal>
      )}

      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Category Confirmation"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
          <p>
            Are you sure you want to delete the category &quot;
            {selectedCategory?.name}&quot;?
          </p>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={closeDeleteModal}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg mr-2 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all duration-200"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      <Toaster />
    </div>
  );
}

export default Category;
