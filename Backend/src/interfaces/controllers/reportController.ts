import { Request, Response } from "express";
import reportInteractor from "../../domain/useCases/auth/reportInteractor";

export default {
    // ##-USER--##//

    reportList: async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const reportList = await reportInteractor.reportList(id);
            res.status(200).json(reportList);
        } catch (error) {
            console.error("Error in reportList controller:", error);
            res.status(500).json({ message: "Failed to fetch report list" });
        }
    },

    // ##-ADMIN--##//
    uploadReport: async (req: Request, res: Response) => {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const { bookingId } = req.body;
            if (!bookingId) {
                return res.status(400).json({ message: "Booking ID is required" });
            }
            if (!files || !files.report || files.report.length === 0) {
                return res.status(400).json({ message: "No report files uploaded" });
            }
            const result = await reportInteractor.addReportData({ bookingId, reportFiles: files.report });
            res.status(200).json({ message: "Report uploaded successfully", result });
        } catch (error) {
            console.error("Error uploading report:", error);
            res.status(500).json({ message: "Failed to upload report" });
        }
    },
    reportListAdmin: async (req: Request, res: Response) => {
        try {
            // Fetch reports and generate signed URLs
            const reports = await reportInteractor.reportListWithSignedUrls();
            res.status(200).json({ reports });
        } catch (error) {
            console.error("Error fetching report list:", error);
            res.status(500).json({ message: "Failed to fetch report list" });
        }
    },
    updateReport: async (req: Request, res: Response) => {
        try {
            const { editReportId } = req.params;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
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
            const result = await reportInteractor.editReportData({ editReportId, bookingId, reportFiles: files.report });
            res.status(200).json({ message: "Report updated successfully", result });
        } catch (error) {
            console.error("Error updating report:", error);
            res.status(500).json({ message: "Failed to update report" });
        }
    },
    publishReport: async (req: Request, res: Response) => {
        try {
            const { reportId } = req.params;
            // Validate reportId presence
            if (!reportId) {
                return res.status(400).json({ message: "Report ID is required" });
            }
            const publishedReport = await reportInteractor.publishReport(reportId);
            if (publishedReport) {
                res.status(200).json({ message: "Report published successfully", publishedReport });
            } else {
                res.status(404).json({ message: "Report not found" });
            }
        } catch (error) {
            console.error("Error publishing report:", error);
            res.status(500).json({ message: "Failed to publish report" });
        }
    },
}