/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { reportListInDb } from "../../../infrastructure/repositories/mongoReportRepository";
// import { generateSignedUrl, uploadToS3 } from "../../../utils/s3Uploader";
// import { getReportsFromDb, publishReportInDb, saveReport, updateReportInDb } from "../../../infrastructure/repositories/mongoReportRepository";

// export default {

//     // ##-USER--##//
//     reportList: async (id: string): Promise<any[]> => {
//         try {
//             // Fetch the list of reports from the database
//             const reportList = await reportListInDb(id);
//             // Enhance each report with signed URLs for their files
//             const enhancedReports = await Promise.all(
//                 reportList.map(async (report) => {
//                     const updatedFiles = await Promise.all(
//                         report.reports.map(async (file: { key: string; filename: string }) => {
//                             if (!file.key) {
//                                 return { filename: file.filename, signedUrl: null }; // Handle missing key
//                             }
//                             try {
//                                 const signedUrl = await generateSignedUrl(file.key); // Generate signed URL
//                                 return { filename: file.filename, signedUrl };
//                             } catch (error) {
//                                 console.error(`Error generating signed URL for key: ${file.key}`, error);
//                                 return { filename: file.filename, signedUrl: null };
//                             }
//                         })
//                     );
//                     // Return a simplified format
//                     return {
//                         id: report._id.toString(),
//                         bookingId: report.bookingId.toString(),
//                         published: report.published,
//                         uploadedAt: report.uploadedAt,
//                         files: updatedFiles,
//                     };
//                 })
//             );
//             return enhancedReports;
//         } catch (error) {
//             console.error("Error in reportList interactor:", error);
//             throw new Error("Failed to fetch report list");
//         }
//     },


//     // ##-ADMIN--##//

//     addReportData: async ({ bookingId, reportFiles }: { bookingId: string; reportFiles: Express.Multer.File[] }) => {
//         const reports = [];
//         for (const reportFile of reportFiles) {
//             const reportData = await uploadToS3(reportFile);
//             const reportKey = reportData.Key;
//             reports.push({
//                 filename: reportFile.originalname,
//                 mimetype: reportFile.mimetype,
//                 size: reportFile.size,
//                 key: reportKey,
//             });
//         }
//         const completeReportData = {
//             bookingId,
//             reports,
//         };
//         const savedReport = await saveReport(completeReportData);
//         return savedReport;
//     },

//     reportListWithSignedUrls: async () => {
//         const reports = await getReportsFromDb();
//         // Generate signed URLs for each file in the reports
//         const reportsWithSignedUrls = await Promise.all(
//             reports.map(async (report) => {
//                 const updatedReports = await Promise.all(
//                     report.reports.map(async (file) => {
//                         if (!file.key) {
//                             return { ...file.toObject(), signedUrl: null }; // Handle missing key
//                         }
//                         try {
//                             const signedUrl = await generateSignedUrl(file.key);
//                             return { ...file.toObject(), signedUrl }; // Add signed URL dynamically
//                         } catch (error) {
//                             console.error(`Error generating signed URL for key: ${file.key}`, error);
//                             return { ...file.toObject(), signedUrl: null };
//                         }
//                     })
//                 );
//                 return {
//                     ...report.toObject(),
//                     reports: updatedReports,
//                 };
//             })
//         );
//         return reportsWithSignedUrls;
//     },

//     editReportData: async ({ editReportId, bookingId, reportFiles }: { editReportId: string; bookingId: string; reportFiles: Express.Multer.File[] }) => {
//         const reports = [];
//         for (const reportFile of reportFiles) {
//             const reportData = await uploadToS3(reportFile);
//             const reportKey = reportData.Key;
//             reports.push({
//                 filename: reportFile.originalname,
//                 mimetype: reportFile.mimetype,
//                 size: reportFile.size,
//                 key: reportKey,
//             });
//         }
//         const updatedReportData = {
//             bookingId,
//             reports,
//         };
//         const updatedReport = await updateReportInDb(editReportId, updatedReportData);
//         return updatedReport;
//     },
//     publishReport: async (reportId: string) => {
//         return await publishReportInDb(reportId);
//     },
// }



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
