"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import reportModel from "../database/dbModel/reportModel";
// import { sendReportPublishedEmail } from "../../utils/emailUtils";
// import { generateSignedUrl } from "../../utils/s3Uploader";
// import mongoose from "mongoose";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const reportModel_1 = __importDefault(require("../database/dbModel/reportModel"));
const emailUtils_1 = require("../../utils/emailUtils");
const s3Uploader_1 = require("../../utils/s3Uploader");
const mongoose_1 = __importStar(require("mongoose"));
class ReportRepository {
    saveReport(reportData) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = new reportModel_1.default(reportData);
            return yield report.save();
        });
    }
    getReports() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield reportModel_1.default
                    .find()
                    .populate("bookingId", "user_id booking_date")
                    .populate({
                    path: "bookingId",
                    populate: { path: "user_id", select: "name" },
                })
                    .sort({ uploadedAt: -1 });
            }
            catch (error) {
                console.error("Error fetching reports from the database:", error);
                throw new Error("Failed to fetch reports");
            }
        });
    }
    updateReport(reportId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedReport = yield reportModel_1.default.findByIdAndUpdate(reportId, updatedData, {
                new: true, // Return the updated document
            });
            if (!updatedReport) {
                throw new Error(`Report with ID ${reportId} not found`);
            }
            return updatedReport;
        });
    }
    publishReport(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const updatedReport = yield reportModel_1.default
                    .findByIdAndUpdate(reportId, { published: true }, { new: true })
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
                const user = booking.user_id;
                if (!user.email || !user.name) {
                    throw new Error("User data is not populated correctly.");
                }
                const reportFile = (_a = updatedReport.reports) === null || _a === void 0 ? void 0 : _a[0];
                if (!reportFile || !reportFile.key) {
                    throw new Error("No report file URL found in the reports array.");
                }
                const downloadLink = yield (0, s3Uploader_1.generateSignedUrl)(reportFile.key);
                yield (0, emailUtils_1.sendReportPublishedEmail)(user.email, reportId, user.name, downloadLink);
                console.log("Report published and email sent.");
                return updatedReport;
            }
            catch (error) {
                console.error("Failed to publish report and send email:", error);
                throw error;
            }
        });
    }
    getReportsByBookingId(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.Types.ObjectId.isValid(bookingId)) {
                    throw new Error("Invalid booking ID format");
                }
                return yield reportModel_1.default.find({
                    bookingId: new mongoose_1.default.Types.ObjectId(bookingId),
                    published: true,
                });
            }
            catch (error) {
                console.error("Error fetching reports by booking ID:", error);
                throw new Error("Failed to retrieve reports");
            }
        });
    }
}
exports.default = new ReportRepository();
