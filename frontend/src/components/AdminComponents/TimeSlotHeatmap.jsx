import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import axiosInstanceUser from "../../api/middlewares/axiosInstanceUser";

const TimeSlotHeatmap = () => {
  const [chartOptions, setChartOptions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await axiosInstanceUser.get("/allbookings");
        const bookings = response.data;

        // Aggregate booking counts by time slot
        const timeSlotCounts = {};
        bookings.forEach((booking) => {
          const timeSlot = booking.booking_time_slot;
          timeSlotCounts[timeSlot] = (timeSlotCounts[timeSlot] || 0) + 1;
        });

        const timeSlots = Object.keys(timeSlotCounts);
        const counts = Object.values(timeSlotCounts);

        // Configure chart options
        const options = {
          title: {
            text: "Bookings by Time Slot",
            left: "center",
            textStyle: {
              color: "#32CD32",
              fontSize: 22,
              fontWeight: "bold",
            },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
            backgroundColor: "#f9f9f9",
            borderColor: "#32CD32",
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
            data: timeSlots,
            name: "Time Slot",
            nameTextStyle: {
              fontSize: 14,
              fontWeight: "bold",
              color: "#333",
            },
            axisLabel: {
              color: "#333",
              fontSize: 12,
              rotate: 45, // Rotate labels for better readability
            },
            axisLine: {
              lineStyle: {
                color: "#333",
              },
            },
          },
          yAxis: {
            type: "value",
            name: "Bookings",
            nameTextStyle: {
              fontSize: 14,
              fontWeight: "bold",
              color: "#333",
            },
            axisLabel: {
              color: "#333",
              fontSize: 12,
            },
            axisLine: {
              lineStyle: {
                color: "#333",
              },
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
              name: "Bookings",
              type: "bar",
              data: counts,
              itemStyle: {
                color: "#32CD32", // Bright green for the bars
              },
              emphasis: {
                focus: "series",
                itemStyle: {
                  color: "#76EE76", // Highlight color on hover
                },
              },
              label: {
                show: true,
                position: "top",
                color: "#32CD32",
                fontWeight: "bold",
              },
            },
          ],
        };

        setChartOptions(options);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        setLoading(false);
      }
    };

    fetchTimeSlots();
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

export default TimeSlotHeatmap;
