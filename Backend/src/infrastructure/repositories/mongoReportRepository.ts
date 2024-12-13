/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import reportModel from "../database/dbModel/reportModel";
// import { sendReportPublishedEmail } from "../../utils/emailUtils";
// import { generateSignedUrl } from "../../utils/s3Uploader";
// import mongoose from "mongoose";

// // ##-ADMIN--##// 

// export const saveReport = async (reportData: any) => {
//     const report = new reportModel(reportData);
//     return await report.save();
// };
// export const getReportsFromDb = async () => {
//     try {
//         // Fetch reports with populated booking and user details
//         return await reportModel
//             .find()
//             .populate('bookingId', 'user_id booking_date')
//             .populate({
//                 path: 'bookingId',
//                 populate: { path: 'user_id', select: 'name' },
//             })
//             .sort({ uploadedAt: -1 });
//     } catch (error) {
//         console.error("Error fetching reports from the database:", error);
//         throw error;
//     }
// };

// export const updateReportInDb = async (reportId: string, updatedData: any) => {
//     const updatedReport = await reportModel.findByIdAndUpdate(reportId, updatedData, {
//         new: true, // Return the updated document
//     });

//     if (!updatedReport) {
//         throw new Error(`Report with ID ${reportId} not found`);
//     }

//     return updatedReport;
// };

// // Function to publish report in the database and send an email notification
// export const publishReportInDb = async (reportId: string): Promise<any> => {
//     try {
//         const updatedReport = await reportModel.findByIdAndUpdate(
//             reportId,
//             { published: true },
//             { new: true }
//         ).populate({
//             path: "bookingId",
//             populate: { path: "user_id", select: "email name" },
//         });

//         if (!updatedReport) {
//             throw new Error("Report not found");
//         }

//         const booking = updatedReport.bookingId;
//         if (!booking || !("user_id" in booking)) {
//             throw new Error("Booking data not populated correctly.");
//         }

//         const user = booking.user_id as { email: string; name: string };
//         if (!user.email || !user.name) {
//             throw new Error("User data is not populated correctly.");
//         }

//         // Retrieve the first PDF URL from the reports array
//         const reportFile = updatedReport.reports?.[0]; // You could also select a specific report if needed
//         if (!reportFile || !reportFile.key) {
//             throw new Error("No report file URL found in the reports array.");
//         }

//         // Generate a signed URL for the file
//         const downloadLink = await generateSignedUrl(reportFile.key);

//         // Send email with the actual S3 download link
//         await sendReportPublishedEmail(user.email, reportId, user.name, downloadLink);
//         console.log("Report published and email with download link sent to user.");

//         return updatedReport;
//     } catch (error) {
//         console.error("Failed to publish report and send email:", error);
//         throw error;
//     }
// };

// // ##-USER--##//

// export const reportListInDb = async (bookingId: string): Promise<any[]> => {
//     try {
//         // Convert bookingId to ObjectId if it's a valid string
//         if (!mongoose.Types.ObjectId.isValid(bookingId)) {
//             throw new Error("Invalid booking ID format");
//         }
//         const objectId = new mongoose.Types.ObjectId(bookingId);

//         // Query reports for specific bookingId and published status
//         const reports = await reportModel.find({
//             bookingId: objectId,
//             published: true,
//         });

//         if (reports.length === 0) {
//             console.log(`No reports found for booking ID ${bookingId} with published status.`);
//         } else {
//             console.log("Reports fetched:", reports);
//         }

//         return reports;
//     } catch (error) {
//         console.error("Error fetching reports from database:", error);
//         throw new Error("Failed to retrieve reports");
//     }
// };

import reportModel from "../database/dbModel/reportModel";
import { sendReportPublishedEmail } from "../../utils/emailUtils";
import { generateSignedUrl } from "../../utils/s3Uploader";
import mongoose, { Types } from "mongoose";

class ReportRepository {
  async saveReport(reportData: any) {
    const report = new reportModel(reportData);
    return await report.save();
  }

  async getReports(): Promise<any[]> {
    try {
      return await reportModel
        .find()
        .populate("bookingId", "user_id booking_date")
        .populate({
          path: "bookingId",
          populate: { path: "user_id", select: "name" },
        })
        .sort({ uploadedAt: -1 });
    } catch (error) {
      console.error("Error fetching reports from the database:", error);
      throw new Error("Failed to fetch reports");
    }
  }

  async updateReport(reportId: string, updatedData: any) {
    const updatedReport = await reportModel.findByIdAndUpdate(reportId, updatedData, {
      new: true, // Return the updated document
    });

    if (!updatedReport) {
      throw new Error(`Report with ID ${reportId} not found`);
    }

    return updatedReport;
  }

  async publishReport(reportId: string): Promise<any> {
    try {
      const updatedReport = await reportModel
        .findByIdAndUpdate(
          reportId,
          { published: true },
          { new: true }
        )
        .populate({
          path: "bookingId",
          populate: { path: "user_id", select: "email name" },
        });

      if (!updatedReport) {
        throw new Error("Report not found");
      }

      const booking = updatedReport.bookingId;
      if (!booking || !("user_id" in booking)) {
        throw new Error("Booking data not populated correctly.");
      }

      const user = booking.user_id as { email: string; name: string };
      if (!user.email || !user.name) {
        throw new Error("User data is not populated correctly.");
      }

      const reportFile = updatedReport.reports?.[0];
      if (!reportFile || !reportFile.key) {
        throw new Error("No report file URL found in the reports array.");
      }

      const downloadLink = await generateSignedUrl(reportFile.key);
      await sendReportPublishedEmail(user.email, reportId, user.name, downloadLink);

      console.log("Report published and email sent.");
      return updatedReport;
    } catch (error) {
      console.error("Failed to publish report and send email:", error);
      throw error;
    }
  }

  async getReportsByBookingId(bookingId: string): Promise<any[]> {
    try {
      if (!Types.ObjectId.isValid(bookingId)) {
        throw new Error("Invalid booking ID format");
      }
      return await reportModel.find({
        bookingId: new mongoose.Types.ObjectId(bookingId),
        published: true,
      });
    } catch (error) {
      console.error("Error fetching reports by booking ID:", error);
      throw new Error("Failed to retrieve reports");
    }
  }
}

export default new ReportRepository();
