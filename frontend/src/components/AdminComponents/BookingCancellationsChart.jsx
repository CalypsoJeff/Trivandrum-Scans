import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import axiosInstanceUser from "../../services/axiosInstanceUser";

const BookingCancellationsChart = () => {
  const [chartOptions, setChartOptions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCancellations = async () => {
      try {
        const response = await axiosInstanceUser.get("/allbookings");
        const bookings = response.data;

        // Filter cancellations and group by date
        const cancellations = bookings.filter(
          (booking) => booking.status === "cancelled"
        );

        const cancellationCounts = {};
        cancellations.forEach((cancellation) => {
          const date = new Date(cancellation.booking_date).toLocaleDateString();
          cancellationCounts[date] = (cancellationCounts[date] || 0) + 1;
        });

        // Sort dates and prepare data
        const sortedDates = Object.keys(cancellationCounts).sort(
          (a, b) => new Date(a) - new Date(b)
        );
        const counts = sortedDates.map((date) => cancellationCounts[date]);

        // Configure chart options
        const options = {
          title: {
            text: "Booking Cancellations",
            left: "center",
            textStyle: {
              color: "#FF6347",
              fontSize: 22,
              fontWeight: "bold",
              fontFamily: "Arial, sans-serif",
            },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "line",
            },
            backgroundColor: "#f2f2f2",
            borderColor: "#FF6347",
            borderWidth: 1,
            textStyle: {
              color: "#333",
            },
          },
          grid: {
            top: "15%",
            bottom: "15%",
            left: "10%",
            right: "10%",
          },
          xAxis: {
            type: "category",
            data: sortedDates,
            name: "Date",
            nameLocation: "middle",
            nameGap: 30,
            axisLine: {
              lineStyle: {
                color: "#333",
              },
            },
            axisLabel: {
              rotate: 45,
              color: "#333",
              fontSize: 12,
            },
            nameTextStyle: {
              fontWeight: "bold",
              fontSize: 14,
            },
          },
          yAxis: {
            type: "value",
            name: "Cancellations",
            axisLine: {
              lineStyle: {
                color: "#333",
              },
            },
            axisLabel: {
              color: "#333",
              fontSize: 12,
            },
            nameTextStyle: {
              fontWeight: "bold",
              fontSize: 14,
            },
            splitLine: {
              lineStyle: {
                color: "#e0e0e0",
                type: "dashed",
              },
            },
          },
          series: [
            {
              name: "Cancellations",
              type: "line",
              data: counts,
              itemStyle: { color: "#FF6347" },
              lineStyle: {
                width: 2,
                color: "#FF6347",
              },
              symbol: "circle",
              symbolSize: 8,
              label: {
                show: true,
                position: "top",
                color: "#FF6347",
                fontSize: 12,
              },
            },
          ],
        };

        setChartOptions(options);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cancellations:", error);
        setLoading(false);
      }
    };

    fetchCancellations();
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (!chartOptions) return <p>No data available to display the chart.</p>;

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

export default BookingCancellationsChart;
