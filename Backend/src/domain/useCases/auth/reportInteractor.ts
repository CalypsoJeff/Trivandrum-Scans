/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
import ReportRepository from "../../../infrastructure/repositories/mongoReportRepository";
import { generateSignedUrl, uploadToS3 } from "../../../utils/s3Uploader";

export default {
  async reportList(bookingId: string): Promise<any[]> {
    try {
      const reports = await ReportRepository.getReportsByBookingId(bookingId);
      return await Promise.all(
        reports.map(async (report) => ({
          ...report.toObject(),
          files: await Promise.all(
            report.reports.map(async (file: { filename: any; key: string; }) => ({
              filename: file.filename,
              signedUrl: file.key ? await generateSignedUrl(file.key) : null,
            }))
          ),
        }))
      );
    } catch (error) {
      console.error("Error fetching report list:", error);
      throw new Error("Failed to fetch report list");
    }
  },

  async addReportData({
    bookingId,
    reportFiles,
  }: {
    bookingId: string;
    reportFiles: Express.Multer.File[];
  }) {
    try {
      const reports = await Promise.all(
        reportFiles.map(async (file) => ({
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          key: (await uploadToS3(file)).Key,
        }))
      );

      const savedReport = await ReportRepository.saveReport({
        bookingId,
        reports,
      });

      return savedReport;
    } catch (error) {
      console.error("Error adding report data:", error);
      throw new Error("Failed to add report data");
    }
  },

  async editReportData({
    editReportId,
    bookingId,
    reportFiles,
  }: {
    editReportId: string;
    bookingId: string;
    reportFiles: Express.Multer.File[];
  }) {
    try {
      const reports = await Promise.all(
        reportFiles.map(async (file) => ({
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          key: (await uploadToS3(file)).Key,
        }))
      );

      const updatedReport = await ReportRepository.updateReport(editReportId, {
        bookingId,
        reports,
      });

      return updatedReport;
    } catch (error) {
      console.error("Error editing report data:", error);
      throw new Error("Failed to edit report data");
    }
  },

  async reportListWithSignedUrls(): Promise<any[]> {
    try {
      const reports = await ReportRepository.getReports();
      return await Promise.all(
        reports.map(async (report) => ({
          ...report.toObject(),
          reports: await Promise.all(
            report.reports.map(async (file: { toObject: () => any; key: string; }) => ({
              ...file.toObject(),
              signedUrl: file.key ? await generateSignedUrl(file.key) : null,
            }))
          ),
        }))
      );
    } catch (error) {
      console.error("Error fetching reports with signed URLs:", error);
      throw new Error("Failed to fetch reports with signed URLs");
    }
  },

  async publishReport(reportId: string): Promise<any> {
    try {
      return await ReportRepository.publishReport(reportId);
    } catch (error) {
      console.error("Error publishing report:", error);
      throw new Error("Failed to publish report");
    }
  },
};
