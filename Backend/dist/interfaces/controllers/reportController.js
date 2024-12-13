"use strict";
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
const reportInteractor_1 = __importDefault(require("../../domain/useCases/auth/reportInteractor"));
exports.default = {
    // ##-USER--##//
    reportList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const reportList = yield reportInteractor_1.default.reportList(id);
            res.status(200).json(reportList);
        }
        catch (error) {
            console.error("Error in reportList controller:", error);
            res.status(500).json({ message: "Failed to fetch report list" });
        }
    }),
    // ##-ADMIN--##//
    uploadReport: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const files = req.files;
            const { bookingId } = req.body;
            if (!bookingId) {
                return res.status(400).json({ message: "Booking ID is required" });
            }
            if (!files || !files.report || files.report.length === 0) {
                return res.status(400).json({ message: "No report files uploaded" });
            }
            const result = yield reportInteractor_1.default.addReportData({ bookingId, reportFiles: files.report });
            res.status(200).json({ message: "Report uploaded successfully", result });
        }
        catch (error) {
            console.error("Error uploading report:", error);
            res.status(500).json({ message: "Failed to upload report" });
        }
    }),
    reportListAdmin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Fetch reports and generate signed URLs
            const reports = yield reportInteractor_1.default.reportListWithSignedUrls();
            res.status(200).json({ reports });
        }
        catch (error) {
            console.error("Error fetching report list:", error);
            res.status(500).json({ message: "Failed to fetch report list" });
        }
    }),
    updateReport: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { editReportId } = req.params;
            const files = req.files;
            const { bookingId } = req.body;
            if (!editReportId) {
                return res.status(400).json({ message: "Report ID is required" });
            }
            if (!bookingId) {
                return res.status(400).json({ message: "Booking ID is required" });
            }
            if (!files || !files.report || files.report.length === 0) {
                return res.status(400).json({ message: "No report file uploaded" });
            }
            const result = yield reportInteractor_1.default.editReportData({ editReportId, bookingId, reportFiles: files.report });
            res.status(200).json({ message: "Report updated successfully", result });
        }
        catch (error) {
            console.error("Error updating report:", error);
            res.status(500).json({ message: "Failed to update report" });
        }
    }),
    publishReport: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { reportId } = req.params;
            // Validate reportId presence
            if (!reportId) {
                return res.status(400).json({ message: "Report ID is required" });
            }
            const publishedReport = yield reportInteractor_1.default.publishReport(reportId);
            if (publishedReport) {
                res.status(200).json({ message: "Report published successfully", publishedReport });
            }
            else {
                res.status(404).json({ message: "Report not found" });
            }
        }
        catch (error) {
            console.error("Error publishing report:", error);
            res.status(500).json({ message: "Failed to publish report" });
        }
    }),
};
