"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { reportListInDb } from "../../../infrastructure/repositories/mongoReportRepository";
// import { generateSignedUrl, uploadToS3 } from "../../../utils/s3Uploader";
// import { getReportsFromDb, publishReportInDb, saveReport, updateReportInDb } from "../../../infrastructure/repositories/mongoReportRepository";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const mongoReportRepository_1 = __importDefault(require("../../../infrastructure/repositories/mongoReportRepository"));
const s3Uploader_1 = require("../../../utils/s3Uploader");
exports.default = {
    reportList(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reports = yield mongoReportRepository_1.default.getReportsByBookingId(bookingId);
                return yield Promise.all(reports.map((report) => __awaiter(this, void 0, void 0, function* () {
                    return (Object.assign(Object.assign({}, report.toObject()), { files: yield Promise.all(report.reports.map((file) => __awaiter(this, void 0, void 0, function* () {
                            return ({
                                filename: file.filename,
                                signedUrl: file.key ? yield (0, s3Uploader_1.generateSignedUrl)(file.key) : null,
                            });
                        }))) }));
                })));
            }
            catch (error) {
                console.error("Error fetching report list:", error);
                throw new Error("Failed to fetch report list");
            }
        });
    },
    addReportData(_a) {
        return __awaiter(this, arguments, void 0, function* ({ bookingId, reportFiles, }) {
            try {
                const reports = yield Promise.all(reportFiles.map((file) => __awaiter(this, void 0, void 0, function* () {
                    return ({
                        filename: file.originalname,
                        mimetype: file.mimetype,
                        size: file.size,
                        key: (yield (0, s3Uploader_1.uploadToS3)(file)).Key,
                    });
                })));
                const savedReport = yield mongoReportRepository_1.default.saveReport({
                    bookingId,
                    reports,
                });
                return savedReport;
            }
            catch (error) {
                console.error("Error adding report data:", error);
                throw new Error("Failed to add report data");
            }
        });
    },
    editReportData(_a) {
        return __awaiter(this, arguments, void 0, function* ({ editReportId, bookingId, reportFiles, }) {
            try {
                const reports = yield Promise.all(reportFiles.map((file) => __awaiter(this, void 0, void 0, function* () {
                    return ({
                        filename: file.originalname,
                        mimetype: file.mimetype,
                        size: file.size,
                        key: (yield (0, s3Uploader_1.uploadToS3)(file)).Key,
                    });
                })));
                const updatedReport = yield mongoReportRepository_1.default.updateReport(editReportId, {
                    bookingId,
                    reports,
                });
                return updatedReport;
            }
            catch (error) {
                console.error("Error editing report data:", error);
                throw new Error("Failed to edit report data");
            }
        });
    },
    reportListWithSignedUrls() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reports = yield mongoReportRepository_1.default.getReports();
                return yield Promise.all(reports.map((report) => __awaiter(this, void 0, void 0, function* () {
                    return (Object.assign(Object.assign({}, report.toObject()), { reports: yield Promise.all(report.reports.map((file) => __awaiter(this, void 0, void 0, function* () {
                            return (Object.assign(Object.assign({}, file.toObject()), { signedUrl: file.key ? yield (0, s3Uploader_1.generateSignedUrl)(file.key) : null }));
                        }))) }));
                })));
            }
            catch (error) {
                console.error("Error fetching reports with signed URLs:", error);
                throw new Error("Failed to fetch reports with signed URLs");
            }
        });
    },
    publishReport(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield mongoReportRepository_1.default.publishReport(reportId);
            }
            catch (error) {
                console.error("Error publishing report:", error);
                throw new Error("Failed to publish report");
            }
        });
    },
};
