import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import axiosInstanceUser from "../../services/axiosInstanceUser";

const DailyBookingsChart = () => {
  const [chartOptions, setChartOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useCreatedAt, setUseCreatedAt] = useState(true); // Toggle state

  const fetchBookings = async () => {
    try {
      const response = await axiosInstanceUser.get("/allbookings");
      const bookings = response.data;

      // Determine which date field to use
      const dateField = useCreatedAt ? "createdAt" : "booking_date";

      // Group bookings by the selected date field
      const bookingCounts = {};
      bookings.forEach((booking) => {
        const date = new Date(booking[dateField]).toLocaleDateString();
        bookingCounts[date] = (bookingCounts[date] || 0) + 1;
      });

      // Sort dates and prepare data
      const sortedDates = Object.keys(bookingCounts).sort(
        (a, b) => new Date(a) - new Date(b)
      );
      const sortedCounts = sortedDates.map((date) => bookingCounts[date]);

      // Chart options
      const options = {
        title: {
          text: `Daily Bookings (${useCreatedAt ? "Booking Date" : "Appointment Date"})`,
          left: "center",
          textStyle: {
            color: "#4CAF50",
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "category",
          data: sortedDates,
          name: "Date",
        },
        yAxis: {
          type: "value",
          name: "Bookings",
        },
        series: [
          {
            name: "Bookings",
            type: "bar",
            data: sortedCounts,
            itemStyle: { color: "#6495ED" },
            label: {
              show: true,
              position: "top",
              color: "#000",
            },
          },
        ],
      };

      setChartOptions(options);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    }
  };

  // Fetch data whenever the toggle changes
  useEffect(() => {
    setLoading(true);
    fetchBookings();
  }, [useCreatedAt]);

  if (loading) return <p>Loading chart...</p>;
  if (!chartOptions) return <p>No data available to display the chart.</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        {/* <h2 className="text-lg font-semibold">Daily Bookings Chart</h2> */}
        <button
          onClick={() => setUseCreatedAt((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Toggle to {useCreatedAt ? "Appointment Date" : "Booking Date"}
        </button>
      </div>
      <ReactECharts
        option={chartOptions}
        style={{ height: "400px", width: "100%" }}
        className="react_for_echarts"
      />
    </div>
  );
};

export default DailyBookingsChart;
