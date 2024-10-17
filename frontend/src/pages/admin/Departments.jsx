/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminComponents/Sidebar";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
  addDepartment,
  deleteDepartment,
  editDepartment,
} from "../../features/admin/adminslice";
import axiosInstance from "../../services/axiosInstance";
import { toast, Toaster } from "sonner";

Modal.setAppElement("#root");

// Validation schema using Yup
const DepartmentSchema = Yup.object().shape({
  name: Yup.string().required("Department Name is required"),
  description: Yup.string().optional(),
});

function Departments() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false); // For delete confirmation modal
  const [departments, setDepartments] = useState([]); // Store departments
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
  const [currentDepartment, setCurrentDepartment] = useState(null); // For editing department
  const [departmentToDelete, setDepartmentToDelete] = useState(null); // For tracking department to delete
  const dispatch = useDispatch();

  // Modal open/close functions
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const openEditModal = (department) => {
    setCurrentDepartment(department); // Set the current department to edit
    setEditModalIsOpen(true);
  };
  const closeEditModal = () => setEditModalIsOpen(false);

  // Open delete confirmation modal
  const openDeleteModal = (department) => {
    setDepartmentToDelete(department);
    setDeleteModalIsOpen(true);
  };
  const closeDeleteModal = () => setDeleteModalIsOpen(false);

  // Fetch departments after adding/editing/deleting
  const fetchDepartments = async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get(`/departmentlist`);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Error fetching departments");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Submit form data for adding
  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      await dispatch(addDepartment(values)).unwrap();
      await fetchDepartments();
      toast.success("Department added successfully");
      closeModal();
      resetForm();
    } catch (error) {
      console.error("Error adding department:", error);
      toast.error("Failed to add department");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit form data for editing
  const handleEditSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await dispatch(
        editDepartment({
          id: currentDepartment._id,
          name: values.name,
          description: values.description,
        })
      ).unwrap();
      await fetchDepartments();
      toast.success("Department updated successfully");
      closeEditModal();
    } catch (error) {
      console.error("Error editing department:", error);
      toast.error("Failed to update department");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete department
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await dispatch(deleteDepartment(departmentToDelete._id)).unwrap();
      await fetchDepartments();
      toast.success("Department deleted successfully");
      closeDeleteModal(); // Close delete modal
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Departments</h1>
          {/* Add Department Button */}
          <button
            onClick={openModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Add Department
          </button>
        </div>

        <p className="text-lg text-gray-600 mb-10">
          Explore the departments available in our service offerings. Select a
          department to edit or delete.
        </p>

        {/* Existing departments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => (
            <div
              key={department._id}
              className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {department.name}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {department.description}
              </p>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => openEditModal(department)}
                  className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(department)}
                  className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Adding a Department */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Add Department"
          className="fixed inset-0 flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New Department</h2>
            <Formik
              initialValues={{ name: "", description: "" }}
              validationSchema={DepartmentSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Department Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter department name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Department Description (Optional)
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter department description"
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
                      {isSubmitting ? "Adding..." : "Add Department"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Modal>

        {/* Modal for Editing a Department */}
        {currentDepartment && (
          <Modal
            isOpen={editModalIsOpen}
            onRequestClose={closeEditModal}
            contentLabel="Edit Department"
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          >
            <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto shadow-lg">
              <h2 className="text-xl font-bold mb-4">Edit Department</h2>
              <Formik
                initialValues={{
                  name: currentDepartment.name,
                  description: currentDepartment.description,
                }}
                validationSchema={DepartmentSchema}
                onSubmit={handleEditSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Department Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter department name"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Department Description (Optional)
                      </label>
                      <Field
                        as="textarea"
                        name="description"
                        className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter department description"
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
          contentLabel="Delete Department Confirmation"
          className="fixed inset-0 flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>
              Are you sure you want to delete the department &quot;
              {departmentToDelete?.name}&quot;?
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
      <Toaster /> {/* Sonner Toaster Component */}
    </div>
  );
}

export default Departments;
