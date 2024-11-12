/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../../components/UserComponents/Header";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosInstanceUser from "../../services/axiosInstanceUser";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { addToCart } from "../../features/cart/cartSlice";
import SearchSortFilter from "../../components/UserComponents/SearchSortFilter";
import { fetchCategories, fetchServices } from "../../services/userService";

function Services() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([]); // New state for categories
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const user = useSelector(selectUser);
  const userId = user?.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadServices = async (page = 1) => {
    try {
      const data = await fetchServices(page, limit);
      setServices(data.services);
      setFilteredServices(data.services);
      setTotalPages(data.totalPages);
    } catch (error) {
      if (error.response && error.response.data.message === "User is blocked") {
        toast.error("Your account has been blocked. Please contact support.");
      } else {
        toast.error("Failed to fetch services");
      }
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const handleAddToCart = async (service) => {
    if (!userId) {
      toast.error("You must be logged in to add items to the cart.");
      return;
    }
    const cartData = {
      userId,
      serviceId: service._id,
    };
    try {
      await dispatch(addToCart(cartData));
      toast.success("Service added to cart!");
      navigate("/cart");
    } catch (error) {
      toast.error("Failed to add service to cart");
      console.error("Failed to add service to cart:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadServices(newPage);
  };

  useEffect(() => {
    loadServices(currentPage);
    loadCategories(); // Call fetchCategories to load categories
  }, [currentPage]);

  // Handle search functionality
  const handleSearch = (searchText) => {
    const filtered = services.filter((service) =>
      service.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  // Handle sort functionality
  const handleSort = (sortValue) => {
    let sortedServices = [...filteredServices];
    if (sortValue === "price") {
      sortedServices.sort((a, b) => a.price - b.price);
    } else if (sortValue === "alphabetical") {
      sortedServices.sort((a, b) => a.name.localeCompare(b.name));
    }
    setFilteredServices(sortedServices);
  };

  // Handle filter functionality
  const handleFilter = (filterValue) => {
    const filtered = services.filter((service) =>
      filterValue ? service.category?.name === filterValue : true
    );
    setFilteredServices(filtered);
  };

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Our Services
        </h1>

        {/* Integrate SearchSortFilter Component */}
        <SearchSortFilter
          onSearch={handleSearch}
          onSort={handleSort}
          onFilter={handleFilter}
          filters={categories.map((cat) => ({
            label: cat.name,
            value: cat.name,
          }))}
          sorts={[
            { label: "Price", value: "price" },
            { label: "Alphabetical", value: "alphabetical" },
          ]}
        />

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <div
                key={service._id}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between"
              >
                {/* Service Image */}
                <img
                  src={service.serviceImageUrl}
                  alt={service.name}
                  className="w-full h-40 object-cover rounded-t-lg mb-4"
                />

                {/* Service Details */}
                <div className="flex-grow">
                  <Link
                    to={`/service/${service._id}`}
                    className="text-xl font-bold text-gray-700 hover:underline block mb-2"
                  >
                    {service.name}
                  </Link>
                  <p className="text-gray-500">
                    Category: {service.category ? service.category.name : "N/A"}
                  </p>
                  <p className="text-blue-500 font-semibold mt-2">
                    Price: Rs {service.price}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-4">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mb-2"
                    onClick={() => handleAddToCart(service)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No services available</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="p-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Services;
