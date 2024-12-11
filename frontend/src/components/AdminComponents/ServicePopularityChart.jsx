import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import axiosInstanceUser from "../../api/middlewares/axiosInstanceUser";


const ServicePopularityChart = () => {
  const [chartOptions, setChartOptions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicePopularity = async () => {
      try {
        // Fetch all bookings data
        const response = await axiosInstanceUser.get("/allbookings");
        const bookings = response.data;
        // Aggregate service counts
        const serviceCounts = {};
        bookings.forEach((booking) => {
          booking.services.forEach((service) => {
            const serviceName = service.service_id.name;
            serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
          });
        });

        // Prepare data for the chart
        const serviceNames = Object.keys(serviceCounts);
        const counts = serviceNames.map((name) => serviceCounts[name]);

        // Configure chart options
        const options = {
          title: {
            text: "Service Popularity",
            left: "center",
            textStyle: {
              color: "#FF4500", // Title color
              fontSize: 18, // Title font size
              fontWeight: "bold", // Title font weight
            },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          xAxis: {
            type: "value",
            name: "Bookings",
          },
          yAxis: {
            type: "category",
            data: serviceNames,
            name: "Services",
          },
          series: [
            {
              name: "Bookings",
              type: "bar",
              data: counts,
              itemStyle: { color: "#FF4500" },
              label: {
                show: true,
                position: "right",
              },
            },
          ],
        };

        // Update state with chart options
        setChartOptions(options);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching service popularity:", error);
        setLoading(false);
      }
    };

    fetchServicePopularity();
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

export default ServicePopularityChart;
