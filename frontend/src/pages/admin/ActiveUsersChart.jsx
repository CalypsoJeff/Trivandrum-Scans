import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import axiosInstanceUser from "../../services/axiosInstanceUser";

const ActiveUsersChart = () => {
  const [chartOptions, setChartOptions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstanceUser.get("/allbookings");
        const bookings = response.data;

        const activeUsers = new Set();
        bookings.forEach((booking) => {
          if (booking.user_id) {
            activeUsers.add(booking.user_id);
          }
        });

        // Prepare chart data
        const chartData = [{ name: "Active Users", value: activeUsers.size }];

        // Configure the chart options
        const options = {
          title: {
            text: "Active Users",
            left: "center",
            textStyle: {
              color: "#4CAF50",
              fontSize: 22,
              fontWeight: "bold",
              fontFamily: "Arial, sans-serif",
            },
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c}",
            backgroundColor: "#f2f2f2",
            borderColor: "#4CAF50",
            borderWidth: 1,
            textStyle: {
              color: "#333",
            },
          },
          grid: {
            top: "20%",
            bottom: "15%",
            left: "10%",
            right: "10%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: chartData.map((item) => item.name),
            name: "User Category",
            axisLabel: {
              rotate: 0,
              color: "#333",
              fontSize: 12,
              fontWeight: "bold",
            },
            axisLine: {
              lineStyle: {
                color: "#333",
              },
            },
            nameTextStyle: {
              fontSize: 14,
              fontWeight: "bold",
            },
          },
          yAxis: {
            type: "value",
            name: "Count",
            axisLabel: {
              color: "#333",
              fontSize: 12,
            },
            axisLine: {
              lineStyle: {
                color: "#333",
              },
            },
            nameTextStyle: {
              fontSize: 14,
              fontWeight: "bold",
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#e0e0e0",
              },
            },
          },
          series: [
            {
              name: "Active Users",
              type: "bar",
              data: chartData.map((item) => item.value),
              itemStyle: {
                color: "#4CAF50",
              },
              emphasis: {
                focus: "series",
                itemStyle: {
                  color: "#66BB6A",
                },
              },
              label: {
                show: true,
                position: "top",
                color: "#4CAF50",
                fontWeight: "bold",
              },
            },
          ],
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <ReactECharts
        option={chartOptions}
        style={{ height: "400px", width: "100%" }}
        className="react_for_echarts"
      />
    </div>
  );
};

export default ActiveUsersChart;
