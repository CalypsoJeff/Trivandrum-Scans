import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import axiosInstanceUser from "../../services/axiosInstanceUser";

const BookingsChart = () => {
  const [chartOptions, setChartOptions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstanceUser.get("/allbookings");
        const bookings = response.data;

        const bookingsByMonth = bookings.reduce((acc, booking) => {
          const date = new Date(booking.date);
          const month = `${date.getFullYear()}-${(
            "0" +
            (date.getMonth() + 1)
          ).slice(-2)}`;

          if (!acc[month]) {
            acc[month] = 1;
          } else {
            acc[month]++;
          }
          return acc;
        }, {});

        const labels = Object.keys(bookingsByMonth).sort(
          (a, b) => new Date(a) - new Date(b)
        );
        const data = labels.map((month) => bookingsByMonth[month]);

        const options = {
          title: {
            text: "Total Bookings Over Time",
            left: "center",
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            data: labels,
            axisLabel: {
              rotate: 45,
              formatter: (value) => value,
            },
          },
          yAxis: {
            type: "value",
            name: "Number of Bookings",
          },
          series: [
            {
              name: "Bookings",
              type: "line",
              data: data,
              smooth: true,
              lineStyle: {
                color: "#a39f74",
                width: 3,
              },
              itemStyle: {
                color: "#a39f74",
              },
              areaStyle: {
                color: "rgba(163, 159, 116, 0.3)",
              },
            },
          ],
          grid: {
            left: "10%",
            right: "10%",
            bottom: "15%",
            containLabel: true,
          },
        };

        setChartOptions(options);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching booking data:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <p>Loading chart...</p>;
  }

  if (!chartOptions) {
    return <p>No data available to display the chart.</p>;
  }

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

export default BookingsChart;
