import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import axiosInstanceUser from "../../api/middlewares/axiosInstanceUser";


const RevenueTrendsChart = () => {
  const [chartOptions, setChartOptions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axiosInstanceUser.get("/allbookings");
        const bookings = response.data;

        // Aggregate revenue by booking date
        const revenueByDate = {};
        bookings.forEach((booking) => {
          if (booking.status !== "cancelled") {
            const date = new Date(booking.booking_date).toLocaleDateString(); // Format date as 'MM/DD/YYYY'
            revenueByDate[date] = (revenueByDate[date] || 0) + booking.total_amount;
          }
        });

        // Prepare data for the chart
        const sortedDates = Object.keys(revenueByDate).sort(
          (a, b) => new Date(a) - new Date(b)
        );
        const revenueValues = sortedDates.map((date) => revenueByDate[date]);

        // Configure chart options
        const options = {
          title: {
            text: "Revenue Trends",
            left: "center",
            textStyle: {
              color: "#4CAF50", // Title color
              fontSize: 18,
              fontWeight: "bold",
            },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "line",
            },
          },
          xAxis: {
            type: "category",
            data: sortedDates,
            name: "Date",
            axisLabel: {
              rotate: 45, // Rotate labels for better visibility
              fontSize: 10,
            },
          },
          yAxis: {
            type: "value",
            name: "Revenue (₹)",
          },
          series: [
            {
              name: "Revenue",
              type: "line",
              data: revenueValues,
              itemStyle: {
                color: "#FFA500",
              },
              lineStyle: {
                width: 2,
              },
              areaStyle: {
                color: "rgba(255, 165, 0, 0.3)", // Add a subtle gradient area below the line
              },
            },
          ],
        };

        setChartOptions(options);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (!chartOptions) return <p>No data available to display the chart.</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <ReactECharts
        option={chartOptions}
        style={{ height: "400px", width: "100%" }}
        className="react_for_echarts"
      />
    </div>
  );
};

export default RevenueTrendsChart;
