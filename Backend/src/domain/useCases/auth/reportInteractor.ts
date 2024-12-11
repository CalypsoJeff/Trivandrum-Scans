/* eslint-disable @typescript-eslint/no-explicit-any */
import { reportListInDb } from "../../../infrastructure/repositories/mongoReportRepository";
import { generateSignedUrl, uploadToS3 } from "../../../utils/s3Uploader";
import { getReportsFromDb, publishReportInDb, saveReport, updateReportInDb } from "../../../infrastructure/repositories/mongoReportRepository";

export default {

    // ##-USER--##//
    reportList: async (id: string): Promise<any[]> => {
        try {
            // Fetch the list of reports from the database
            const reportList = await reportListInDb(id);
            // Enhance each report with signed URLs for their files
            const enhancedReports = await Promise.all(
                reportList.map(async (report) => {
                    const updatedFiles = await Promise.all(
                        report.reports.map(async (file: { key: string; filename: string }) => {
                            if (!file.key) {
                                return { filename: file.filename, signedUrl: null }; // Handle missing key
                            }
                            try {
                                const signedUrl = await generateSignedUrl(file.key); // Generate signed URL
                                return { filename: file.filename, signedUrl };
                            } catch (error) {
                                console.error(`Error generating signed URL for key: ${file.key}`, error);
                                return { filename: file.filename, signedUrl: null };
                            }
                        })
                    );
                    // Return a simplified format
                    return {
                        id: report._id.toString(),
                        bookingId: report.bookingId.toString(),
                        published: report.published,
                        uploadedAt: report.uploadedAt,
                        files: updatedFiles,
                    };
                })
            );
            return enhancedReports;
        } catch (error) {
            console.error("Error in reportList interactor:", error);
            throw new Error("Failed to fetch report list");
        }
    },


    // ##-ADMIN--##//

    addReportData: async ({ bookingId, reportFiles }: { bookingId: string; reportFiles: Express.Multer.File[] }) => {
        const reports = [];
        for (const reportFile of reportFiles) {
            const reportData = await uploadToS3(reportFile);
            const reportKey = reportData.Key;
            reports.push({
                filename: reportFile.originalname,
                mimetype: reportFile.mimetype,
                size: reportFile.size,
                key: reportKey,
            });
        }
        const completeReportData = {
            bookingId,
            reports,
        };
        const savedReport = await saveReport(completeReportData);
        return savedReport;
    },

    reportListWithSignedUrls: async () => {
        const reports = await getReportsFromDb();
        // Generate signed URLs for each file in the reports
        const reportsWithSignedUrls = await Promise.all(
            reports.map(async (report) => {
                const updatedReports = await Promise.all(
                    report.reports.map(async (file) => {
                        if (!file.key) {
                            return { ...file.toObject(), signedUrl: null }; // Handle missing key
                        }
                        try {
                            const signedUrl = await generateSignedUrl(file.key);
                            return { ...file.toObject(), signedUrl }; // Add signed URL dynamically
                        } catch (error) {
                            console.error(`Error generating signed URL for key: ${file.key}`, error);
                            return { ...file.toObject(), signedUrl: null };
                        }
                    })
                );
                return {
                    ...report.toObject(),
                    reports: updatedReports,
                };
            })
        );
        return reportsWithSignedUrls;
    },

    editReportData: async ({ editReportId, bookingId, reportFiles }: { editReportId: string; bookingId: string; reportFiles: Express.Multer.File[] }) => {
        const reports = [];
        for (const reportFile of reportFiles) {
            const reportData = await uploadToS3(reportFile);
            const reportKey = reportData.Key;
            reports.push({
                filename: reportFile.originalname,
                mimetype: reportFile.mimetype,
                size: reportFile.size,
                key: reportKey,
            });
        }
        const updatedReportData = {
            bookingId,
            reports,
        };
        const updatedReport = await updateReportInDb(editReportId, updatedReportData);
        return updatedReport;
    },
    publishReport: async (reportId: string) => {
        return await publishReportInDb(reportId);
    },
}