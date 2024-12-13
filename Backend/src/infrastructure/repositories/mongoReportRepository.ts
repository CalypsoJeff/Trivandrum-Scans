/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
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
