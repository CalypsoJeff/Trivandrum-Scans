import React, { useState, useEffect } from "react";
import Sidebar from "../../components/AdminComponents/Sidebar";
import Modal from "react-modal";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css"; // Include the cropper.css
import { addService, updateService } from "../../features/admin/adminslice";
import SearchSortFilter from "../../components/AdminComponents/SearchSortFilter";

Modal.setAppElement("#root");

function Service() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [categories, setCategories] = useState([]); 
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]); // For filtered data
  const [serviceData, setServiceData] = useState({
    name: "",
    price: "",
    category: "",
    preTestPreparations: "",
    expectedResultDuration: "",
    description: "",
  });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [cropperInstance, setCropperInstance] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const dispatch = useDispatch();

  const fetchCategory = async () => {
    try {
      const response = await axiosInstance.get(`/categoryList?page=1&limit=10`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories");
    }
  };

  const fetchService = async () => {
    try {
      const response = await axiosInstance.get(`/serviceList?page=1&limit=10`);
      const { services } = response.data;
      if (Array.isArray(services)) {
        setServices(services);
        setFilteredServices(services); // Initialize filteredServices with fetched data
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Error fetching services");
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchService();
  }, []);

  // Search, Sort, and Filter Handlers
  const handleSearch = (searchText) => {
    const filtered = services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchText.toLowerCase()) ||
        service.category?.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  const handleSort = (sortValue) => {
    let sortedServices = [...filteredServices];
    if (sortValue === "price") {
      sortedServices.sort((a, b) => a.price - b.price);
    } else if (sortValue === "name") {
      sortedServices.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === "category") {
      sortedServices.sort((a, b) => a.category?.name.localeCompare(b.category?.name));
    }
    setFilteredServices(sortedServices);
  };

  const handleFilter = (filterValue) => {
    const filtered = services.filter(
      (service) => filterValue ? service.category?._id === filterValue : true
    );
    setFilteredServices(filtered);
  };

  const openModal = () => {
    setServiceData({
      name: "",
      price: "",
      category: "",
      preTestPreparations: "",
      expectedResultDuration: "",
      description: "",
    });
    setEditingServiceId(null);
    setModalIsOpen(true);
  };

  const openEditModal = (service) => {
    setServiceData({
      name: service.name,
      price: service.price,
      category: service.category?._id || "",
      preTestPreparations: service.preTestPreparations || "",
      expectedResultDuration: service.expectedResultDuration,
      description: service.description || "",
    });
    setEditingServiceId(service._id);
    setModalIsOpen(true);
  };

  const closeModal = () => setModalIsOpen(false);

  const handleInputChange = (e) => {
    setServiceData({ ...serviceData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    const file = event?.target?.files[0];
    if (file) {
      const imageElement = document.getElementById("image-preview");
      const reader = new FileReader();

      reader.onload = (e) => {
        imageElement.src = e?.target?.result;
        if (cropperInstance) {
          cropperInstance.destroy();
        }

        const cropper = new Cropper(imageElement, {
          aspectRatio: 1,
          viewMode: 2,
        });

        setCropperInstance(cropper);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (cropperInstance) {
      const canvas = cropperInstance.getCroppedCanvas();
      canvas.toBlob((blob) => {
        const croppedFile = new File([blob], "cropped-image.jpg", {
          type: "image/jpeg",
        });
        setCroppedImage(croppedFile);
        setImageFile(croppedFile);
        const croppedImageUrl = URL.createObjectURL(blob);
        document.getElementById("cropped-image-preview").src = croppedImageUrl;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", serviceData.name);
    formData.append("price", serviceData.price);
    formData.append("category", serviceData.category);
    formData.append("preTestPreparations", serviceData.preTestPreparations);
    formData.append("expectedResultDuration", serviceData.expectedResultDuration);
    formData.append("description", serviceData.description);

    if (imageFile) {
      formData.append("serviceImage", imageFile);
    }

    try {
      if (editingServiceId) {
        await dispatch(updateService({ id: editingServiceId, formData }));
        toast.success("Service updated successfully");
      } else {
        await dispatch(addService(formData));
        toast.success("Service added successfully");
      }
      fetchService();
    } catch (error) {
      console.error("Error adding/updating service:", error);
      toast.error("Failed to add/update service");
    }

    closeModal();
  };

  const toggleListing = async (id, isAvailable) => {
    try {
      await axiosInstance.patch(`/service/${id}/toggleListing`);
      toast.success(
        `Service ${isAvailable ? "unlisted" : "listed"} successfully`
      );
      fetchService();
    } catch (error) {
      console.error("Error toggling listing status:", error);
      toast.error("Failed to toggle listing status");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-auto">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Service List
          </h1>
          <p className="text-gray-600 mb-6">
            Below is a list of services available. You can add new services or
            manage existing ones.
          </p>

          {/* Integrate SearchSortFilter Component */}
          <SearchSortFilter
            onSearch={handleSearch}
            onSort={handleSort}
            onFilter={handleFilter}
            filters={categories.map(category => ({
              label: category.name,
              value: category._id
            }))}
            sorts={[
              { label: "Name", value: "name" },
              { label: "Price", value: "price" },
              { label: "Category", value: "category" }
            ]}
          />

          {/* Add Service Button */}
          <div className="flex justify-end mb-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
              onClick={openModal}
            >
              Add New Service
            </button>
          </div>

          {/* Service Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white table-auto">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="py-3 px-6 text-left">Service Name</th>
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-center">Price</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <tr
                      key={service._id}
                      className="border-b hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left">{service.name}</td>
                      <td className="py-3 px-6 text-left">
                        {service.category
                          ? `${service.category.name} (ID: ${service.category._id})`
                          : "Category not available"}
                      </td>
                      <td className="py-3 px-6 text-center">
                        Rs {service.price}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={() => openEditModal(service)}
                          className="text-blue-500 hover:underline mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            toggleListing(service._id, service.isAvailable)
                          }
                          className="text-yellow-500 hover:underline"
                        >
                          {service.isAvailable ? "Unlist" : "List"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-3 px-6 text-center text-gray-500"
                    >
                      No services available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Adding/Editing a Service */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Add New Service"
          className="w-full max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingServiceId ? "Edit Service" : "Add New Service"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                {/* Service Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Service Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={serviceData.name}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Price */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={serviceData.price}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={serviceData.category}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="" disabled>
                      Select a Category
                    </option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Expected Result Duration */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Expected Result Duration
                  </label>
                  <input
                    type="text"
                    name="expectedResultDuration"
                    value={serviceData.expectedResultDuration}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Pre-test Preparations */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Pre-test Preparations (Optional)
                  </label>
                  <textarea
                    name="preTestPreparations"
                    value={serviceData.preTestPreparations}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={serviceData.description}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                {/* Image Uploader */}
                <div className="mb-4 col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Service Image
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Supported formats: JPG, PNG, WEBP
                  </p>
                </div>

                {/* Image Preview */}
                <div className="mb-4 col-span-2 grid grid-cols-2 gap-4">
                  <div className="border border-gray-300 rounded-lg bg-gray-100 h-64 flex items-center justify-center">
                    <img
                      id="image-preview"
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="border border-gray-300 rounded-lg bg-gray-100 h-64 flex items-center justify-center">
                    <img
                      id="cropped-image-preview"
                      alt="Cropped Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                {/* Crop Actions */}
                <div className="col-span-2 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCrop}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Crop Image
                  </button>
                  <button
                    type="button"
                    disabled={!croppedImage}
                    className={`${
                      croppedImage
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-300 cursor-not-allowed"
                    } text-white font-semibold py-2 px-4 rounded-lg`}
                  >
                    Image Ready
                  </button>
                </div>
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                >
                  {editingServiceId ? "Update Service" : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Service;
