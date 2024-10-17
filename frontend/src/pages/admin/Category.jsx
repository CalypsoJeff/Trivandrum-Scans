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
} from "../../features/admin/adminslice"; // Import actions
import axiosInstance from "../../services/axiosInstance"; // Import axios for fetching departments
import { toast, Toaster } from "sonner"; // Import Sonner for toasts

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
  const fetchDepartments = async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get(
        `/departmentlist?page=${page}&limit=${limit}`
      );
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Error fetching departments");
    }
  };

  useEffect(() => {
    fetchDepartments(); // Fetch departments on mount
  }, []);

  // Fetch categories
  const fetchCategory = async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get(
        `/categoryList?page=${page}&limit=${limit}`
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  // Handle adding a new category
  const handleSubmit = async (values, { resetForm }) => {
    try {
      await dispatch(addCategory(values)).unwrap();
      toast.success("Category added successfully");
      closeModal();
      resetForm();
      fetchCategory(); // Refresh categories
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    }
  };

  // Handle editing a category
  const handleEditSubmit = async (values) => {
    try {
      await dispatch(
        editCategory({ id: selectedCategory._id, ...values })
      ).unwrap();
      toast.success("Category updated successfully");
      closeEditModal();
      fetchCategory(); // Refresh categories
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  // Handle deleting a category
  const handleDelete = async () => {
    try {
      await dispatch(deleteCategory(selectedCategory._id)).unwrap();
      toast.success("Category deleted successfully");
      closeDeleteModal();
      fetchCategory(); // Refresh categories
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
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
            {categories.length === 0 ? (
              <p className="text-gray-500">No categories available.</p>
            ) : (
              categories.map((category) => (
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
        </div>

        {/* Modal for Adding a Category */}
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

        {/* Modal for Editing a Category */}
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

        {/* Modal for Confirming Deletion */}
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
      </div>
      <Toaster />
    </div>
  );
}

export default Category;
