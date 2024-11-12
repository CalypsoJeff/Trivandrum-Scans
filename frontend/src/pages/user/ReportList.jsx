import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { fetchUserReports } from "../../services/userService";

function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(selectUser);
  const userId = user.id;

  // Fetch reports on mount
  useEffect(() => {
    const loadReports = async () => {
      try {
        const publishedReports = await fetchUserReports(userId);
        setReports(publishedReports);
      } catch (err) {
        setError("Failed to fetch reports");
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [userId]);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Available Reports</h1>
      {reports.length > 0 ? (
        <ul className="space-y-4">
          {reports.map((report) => (
            <li key={report._id} className="p-4 bg-gray-100 rounded-lg shadow">
              <p>
                <strong>Report ID:</strong> {report._id}
              </p>
              <p>
                <strong>Booking ID:</strong> {report.bookingId._id}
              </p>
              <p>
                <strong>Uploaded On:</strong>{" "}
                {new Date(report.uploadedAt).toLocaleDateString()}
              </p>
              <div className="mt-2 flex gap-4 overflow-x-auto">
                {report.reports.map((file, index) => (
                  <a
                    key={index}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {file.filename}
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reports available.</p>
      )}
    </div>
  );
}

export default ReportList;
