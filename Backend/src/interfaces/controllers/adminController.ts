export default {
  // adminLogin: async (req: Request, res: Response) => {
  //   try {
  //     const { email, password } = req.body;
  //     if (!email || !password) {
  //       return res.status(400).json({ error: "Admin Credentials missing" });
  //     }
  //     const Credentials = { email, password };
  //     const response = await adminInteractor.loginAdmin(Credentials);
  //     res.status(200).json({ message: "Login Successful", response });
  //   } catch (error: unknown) {
  //     console.error("Error during admin login:", error);
  //     if (error instanceof Error) {
  //       res.status(500).json({ error: error.message });
  //     } else {
  //       res.status(500).json({ error: "An unexpected error occurred" });
  //     }
  //   }
  // },
  // getUsers: async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const { page = 1, limit = 10 } = req.query;
  //     const users = await adminInteractor.getUsers(Number(page), Number(limit));
  //     res.status(200).json(users);
  //   } catch (error: unknown) {
  //     console.error("Error fetching users:", error);
  //     if (error instanceof Error) {
  //       res.status(500).json({ error: error.message });
  //     } else {
  //       res.status(500).json({ error: "An unexpected error occurred" });
  //     }
  //   }
  // },
  // getCategories: async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const categories = await adminInteractor.getCategories(
  //     );
  //     res.status(200).json(categories);
  //   } catch (error: unknown) {
  //     console.error("Error fetching categories:", error);
  //     if (error instanceof Error) {
  //       res.status(500).json({ error: error.message });
  //     } else {
  //       res.status(500).json({ error: "An unexpected error occurred" });
  //     }
  //   }
  // },
  // blockUser: async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const { userId } = req.params;
  //     const { is_blocked } = req.body;
  //     const updatedUser = await adminInteractor.updatedUserStatus(
  //       userId,
  //       is_blocked
  //     );
  //     res.status(200).json(updatedUser);
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error(error.message); // Safely access `message` only if it's an instance of `Error`
  //       res.status(500).json({ error: error.message });
  //     } else {
  //       res.status(500).json({ error: "An unexpected error occurred" });
  //     }
  //   }
  // },
  // addDepartment: async (req: Request, res: Response) => {
  //   try {
  //     const { name, description } = req.body;
  //     if (!name) {
  //       return res.status(400).json({ error: "Department name is required" });
  //     }
  //     const departmentData = {
  //       departmentName: name,
  //       departmentDescription: description,
  //     };
  //     const Department = await adminInteractor.addDepartment(departmentData);
  //     res.status(200).json({ message: "Department Added Successfully", Department });
  //   } catch (error: unknown) {
  //     console.error("Error adding department:", error);
  //     if (error instanceof Error) {
  //       res.status(500).json({ error: error.message });
  //     } else {
  //       res.status(500).json({ error: "An unexpected error occurred" });
  //     }
  //   }
  // },
  // departmentList: async (req: Request, res: Response) => {
  //   try {
  //     const departments = await adminInteractor.getDepartments();
  //     res.status(200).json(departments);
  //   } catch (error: unknown) {
  //     console.error("Error fetching department:", error);
  //     if (error instanceof Error) {
  //       res.status(500).json({ error: error.message });
  //     } else {
  //       res.status(500).json({ error: "An unexpected error occurred" });
  //     }
  //   }
  // },
  // editDepartment: async (req: Request, res: Response) => {
  //   try {
  //     const { id } = req.params;
  //     const { name, description } = req.body;
  //     if (!id) {
  //       return res.status(400).json({ error: "Department ID is required" });
  //     }
  //     if (!name) {
  //       return res.status(400).json({ error: "Department name is required" });
  //     }
  //     const departmentData = { name, description };
  //     const updatedDepartment = await adminInteractor.editDepartment(
  //       id as string,
  //       departmentData
  //     );
  //     return res.status(200).json({
  //       message: "Department updated successfully",
  //       department: updatedDepartment,
  //     });
  //   } catch (error) {
  //     console.error("Error editing department:", error);
  //     if (error instanceof Error) {
  //       res.status(500).json({ error: error.message });
  //     } else {
  //       res.status(500).json({ error: "An unexpected error occurred" });
  //     }
  //   }
  // },
  // deleteDepartment: async (req: Request, res: Response) => {
  //   try {
  //     const { id } = req.params;
  //     if (!id) {
  //       return res.status(400).json({ error: "Department ID is required" });
  //     }
  //     const deletedDepartment = await adminInteractor.deleteDepartment(
  //       id as string
  //     );
  //     if (!deletedDepartment) {
  //       return res.status(404).json({ error: "Department not found" });
  //     }
  //     return res
  //       .status(200)
  //       .json({ message: "Department deleted successfully", id });
  //   } catch (error) {
  //     console.error("Error deleting department:", error);
  //     if (error instanceof Error) {
  //       res.status(500).json({ error: error.message });
  //     } else {
  //       res.status(500).json({ error: "An unexpected error occurred" });
  //     }
  //   }
  // },
  // addCategory: async (req: Request, res: Response) => {
  //   try {
  //     const { name, department } = req.body;
  //     if (!name || !department) {
  //       return res
  //         .status(400)
  //         .json({ error: "Category name and department are required" });
  //     }
  //     const newCategoryData = { name, department };
  //     const category = await adminInteractor.addCategory(newCategoryData);
  //     return res
  //       .status(201)
  //       .json({ message: "Category added successfully", category });
  //   } catch (error: unknown) {
  //     console.error("Error adding category:", error);
  //     if (error instanceof Error) {
  //       return res.status(500).json({ error: error.message });
  //     } else {
  //       return res.status(500).json({ error: "An unexpected error occurred" });
  //     }
  //   }
  // },
  // editCategory: async (req: Request, res: Response) => {
  //   try {
  //     const { id } = req.params;
  //     const { name, department } = req.body;
  //     if (!id) {
  //       return res.status(400).json({ error: "Category ID is required" });
  //     }
  //     if (!name || !department) {
  //       return res
  //         .status(400)
  //         .json({ error: "Category name and department are required" });
  //     }
  //     const updatedCategory = await adminInteractor.updateCategory(id, {
  //       name,
  //       department,
  //     });
  //     res
  //       .status(200)
  //       .json({ message: "Category updated successfully", updatedCategory });
  //   } catch (error: unknown) {
  //     console.error("Error updating category:", error);
  //     if (error instanceof Error) {
  //       res.status(500).json({ error: error.message });
  //     } else {
  //       res.status(500).json({ error: "An unexpected error occurred" });
  //     }
  //   }
  // },
  // deleteCategory: async (req: Request, res: Response) => {
  //   try {
  //     const { id } = req.params;
  //     if (!id) {
  //       return res.status(400).json({ error: "Category ID is required" });
  //     }
  //     await adminInteractor.deleteCategory(id);
  //     res.status(200).json({ message: "Category deleted successfully" });
  //   } catch (error: unknown) {
  //     console.error("Error deleting category:", error);
  //     if (error instanceof Error) {
  //       res.status(500).json({ error: error.message });
  //     } else {
  //       res.status(500).json({ error: "An unexpected error occurred" });
  //     }
  //   }
  // },
  // getUserCount: async (req: Request, res: Response) => {
  //   try {
  //     const userCounts = await userCount();
  //     res.json(userCounts);
  //   } catch (error) {
  //     console.error("Failed to fetch bookings", error);
  //     res.status(500).json({ message: "Failed to fetch bookings" });
  //   }
  // },
  // getDepartmentCount: async (req: Request, res: Response) => {
  //   try {
  //     const departmentCounts = await departmentCount();
  //     res.json(departmentCounts);
  //   } catch (error) {
  //     console.error("Failed to fetch department Count", error);
  //     res.status(500).json({ message: "Failed to fetch department Count" });
  //   }
  // },
  // getCategoryCount: async (req: Request, res: Response) => {
  //   try {
  //     const categoryCounts = await categoryCount();
  //     res.json(categoryCounts);
  //   } catch (error) {
  //     console.error("Failed to fetch department Count", error);
  //     res.status(500).json({ message: "Failed to fetch department Count" });
  //   }
  // },
  // addService: async (req: Request, res: Response) => {
  //   try {
  //     const {
  //       name,
  //       price,
  //       category,
  //       preTestPreparations,
  //       expectedResultDuration,
  //       description,
  //     } = req.body;
  //     const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  //     const serviceImage = files?.serviceImage?.[0];
  //     if (!serviceImage) {
  //       console.error("Service Image is missing.");
  //       return res
  //         .status(400)
  //         .json({ message: "License document is required" });
  //     }
  //     const serviceData = {
  //       name, price, category, preTestPreparations, expectedResultDuration, description, serviceImage,
  //     };
  //     const result = await adminInteractor.addServiceData(serviceData);
  //     res.status(200).json({ message: "Service added successfully", result });
  //   } catch (error) {
  //     console.error("Failed to add service", error);
  //     res.status(500).json({ message: "Failed to add service" });
  //   }
  // },
  // editService: async (req: Request, res: Response) => {
  //   try {
  //     const { id } = req.params; // Get the service ID from the URL parameters
  //     const { name, price, category, preTestPreparations, expectedResultDuration, description, } = req.body;
  //     const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  //     const serviceImage = files?.serviceImage?.[0];
  //     const serviceData = {
  //       name,
  //       price,
  //       category,
  //       preTestPreparations,
  //       expectedResultDuration,
  //       description,
  //       ...(serviceImage && { serviceImage }), // Add only if image is provided
  //     };
  //     const result = await adminInteractor.editServiceData(id, serviceData);
  //     res.status(200).json({ message: "Service edited successfully", result });
  //   } catch (error) {
  //     console.error("Failed to edit service", error);
  //     res.status(500).json({ message: "Failed to edit service" });
  //   }
  // },
  // getServices: async (req: Request, res: Response) => {
  //   try {
  //     const serviceList = await adminInteractor.getServiceList(
  //     );
  //     res.status(200).json(serviceList);
  //   } catch (error) {
  //     console.error("Failed to retrieve services", error);
  //     res.status(500).json({ message: "Failed to retrieve services" });
  //   }
  // },
  // toggleService: async (req: Request, res: Response) => {
  //   try {
  //     const { id } = req.params;
  //     const toggled = adminInteractor.toggleService(id);
  //     res.status(200).json(toggled);
  //   } catch (error) {
  //     console.error("Failed to toggle services", error);
  //     res.status(500).json({ message: "Failed to toggle services" });
  //   }
  // },
  // bookingList: async (req: Request, res: Response) => {
  //   try {
  //     const page = parseInt(req.query.page as string) || 1;
  //     const limit = parseInt(req.query.limit as string) || 10;
  //     const { bookings, totalBookings } = await adminInteractor.getBookingList(
  //       page,
  //       limit
  //     );
  //     res.status(200).json({
  //       bookings,
  //       totalPages: Math.ceil(totalBookings / limit), // Correctly calculate total pages
  //       currentPage: page,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching booking list:", error);
  //     res.status(500).json({ message: "Failed to fetch bookings" });
  //   }
  // },
  // getBookingDetails: async (req: Request, res: Response) => {
  //   try {
  //     const { id } = req.params;
  //     const bookingDetails = await adminInteractor.fetchBookingDetails(id);

  //     if (!bookingDetails) {
  //       return res.status(404).json({ message: "Booking not found" });
  //     }
  //     res.status(200).json(bookingDetails);
  //   } catch (error) {
  //     console.error("Error fetching booking details:", error);
  //     res.status(500).json({ message: "Failed to fetch details" });
  //   }
  // },
  // getActiveChats: async (req: Request, res: Response) => {
  //   try {
  //     const { adminId } = req.params;
  //     console.log(adminId, 'adminId for active chats');

  //     const activeChats = await ChatModel.find({
  //       users: adminId,
  //     })
  //       .populate('users', 'name')   // Populate to get names of users in the chat
  //       .populate('latestMessage');   // Populate latest message details
  //     console.log(activeChats, 'activeChats for admin');
  //     res.status(200).json(activeChats);
  //   } catch (error) {
  //     console.error('Error fetching active chats for admin:', error);
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // },
  // getMessages: async (req: Request, res: Response) => {
  //   const { chatId } = req.params;
  //   try {
  //     const messages = await Message.find({ chat: chatId })
  //       .populate('sender', 'name')
  //       .sort({ createdAt: 1 });  // Sort messages by creation time

  //     res.json(messages);
  //   } catch (error) {
  //     console.error('Error fetching messages for chat:', error);
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // },
  // getChats: async (req: Request, res: Response) => {
  //   try {
  //     const chats = await ChatModel.find({})
  //       .populate({ path: "users", select: "name" })
  //       .populate({
  //         path: "latestMessage",
  //         select: "content createdAt",
  //       })
  //       .sort({ "latestMessage.createdAt": -1 })
  //       .exec();

  //     res.status(200).json({ chats });
  //   } catch (error) {
  //     console.error("Error fetching chats:", error);
  //     res.status(500).json({ message: "Server error during chat retrieval" });
  //   }
  // },
  // getChatLists: async (req: Request, res: Response) => {
  //   try {
  //     const chats = await ChatModel.find()
  //       .populate('users', 'name')
  //       .populate('latestMessage', 'content createdAt')
  //       .sort({ 'latestMessage.createdAt': -1 });

  //     res.status(200).json(chats);
  //   } catch (error) {
  //     console.error("Error fetching chat list:", error);
  //     res.status(500).json({ message: "Server error fetching chat list" });
  //   }
  // },
  // updateBooking: async (req: Request, res: Response) => {
  //   try {
  //     const { bookingId, serviceId } = req.params;
  //     const { completed } = req.body;
  //     const updatedBooking = await adminInteractor.updateServiceBooking(bookingId, serviceId, completed);
  //     if (!updatedBooking) {
  //       return res.status(404).json({ message: "Booking or service not found" });
  //     }
  //     res.json({ message: "Service completion status updated", booking: updatedBooking });
  //   } catch (error) {
  //     console.error("Error updating Bookings:", error);
  //     res.status(500).json({ message: "Server error updating Bookings" });
  //   }
  // },
  // serviceCompleted: async (req: Request, res: Response) => {
  //   try {
  //     const bookings = await adminInteractor.CompletedBooking();
  //     res.status(200).json({ bookings });
  //   } catch (error) {
  //     console.error("Error in serviceCompleted:", error);
  //     res.status(500).json({ message: "Failed to fetch completed bookings." });
  //   }
  // },
  // uploadReport: async (req: Request, res: Response) => {
  //   try {
  //     const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  //     const { bookingId } = req.body;
  //     if (!bookingId) {
  //       return res.status(400).json({ message: "Booking ID is required" });
  //     }
  //     if (!files || !files.report || files.report.length === 0) {
  //       return res.status(400).json({ message: "No report files uploaded" });
  //     }
  //     const result = await adminInteractor.addReportData({ bookingId, reportFiles: files.report });
  //     res.status(200).json({ message: "Report uploaded successfully", result });
  //   } catch (error) {
  //     console.error("Error uploading report:", error);
  //     res.status(500).json({ message: "Failed to upload report" });
  //   }
  // },
  // reportList: async (req: Request, res: Response) => {
  //   try {
  //     // Fetch reports and generate signed URLs
  //     const reports = await adminInteractor.reportListWithSignedUrls();
  //     res.status(200).json({ reports });
  //   } catch (error) {
  //     console.error("Error fetching report list:", error);
  //     res.status(500).json({ message: "Failed to fetch report list" });
  //   }
  // },

  // updateReport: async (req: Request, res: Response) => {
  //   try {
  //     const { editReportId } = req.params;
  //     const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  //     const { bookingId } = req.body;
  //     if (!editReportId) {
  //       return res.status(400).json({ message: "Report ID is required" });
  //     }
  //     if (!bookingId) {
  //       return res.status(400).json({ message: "Booking ID is required" });
  //     }
  //     if (!files || !files.report || files.report.length === 0) {
  //       return res.status(400).json({ message: "No report file uploaded" });
  //     }
  //     const result = await adminInteractor.editReportData({ editReportId, bookingId, reportFiles: files.report });
  //     res.status(200).json({ message: "Report updated successfully", result });
  //   } catch (error) {
  //     console.error("Error updating report:", error);
  //     res.status(500).json({ message: "Failed to update report" });
  //   }
  // },
  // publishReport: async (req: Request, res: Response) => {
  //   try {
  //     const { reportId } = req.params;
  //     // Validate reportId presence
  //     if (!reportId) {
  //       return res.status(400).json({ message: "Report ID is required" });
  //     }
  //     const publishedReport = await adminInteractor.publishReport(reportId);
  //     if (publishedReport) {
  //       res.status(200).json({ message: "Report published successfully", publishedReport });
  //     } else {
  //       res.status(404).json({ message: "Report not found" });
  //     }
  //   } catch (error) {
  //     console.error("Error publishing report:", error);
  //     res.status(500).json({ message: "Failed to publish report" });
  //   }
  // },
  // successMessage: async (req: Request, res: Response) => {
  //   const { chatId } = req.params;
  //   const { content } = req.body;
  //   try {
  //     const newMessage = await adminInteractor.successMessage(chatId, content);
  //     res.status(200).json({ message: "Message sent successfully", newMessage });
  //   } catch (error) {
  //     console.error("Error sending success message:", error);
  //     res.status(500).json({ message: "Failed to send message" });
  //   }
  // },
}
