import { Request, Response } from "express";
import { IServiceUpdate } from "../../domain/entities/types/serviceType";
import Cart from "../../infrastructure/database/dbModel/cartModel";
import cartInteractor from "../../domain/useCases/auth/cartInteractor";

export default {
    addToCart: async (req: Request, res: Response) => {
        try {
            const { userId, serviceId } = req.body;
            await cartInteractor.addToCart(userId, serviceId);
            res.status(200).json({ message: "successfully added to cart" });
        } catch (error) {
            console.error("Failed to add service to user cart", error);
            res.status(500).json({ message: "Failed to add service to user cart" });
        }
    },
    fetchCart: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const cart = await cartInteractor.getCart(id);
            res.status(200).json(cart);
        } catch (error) {
            console.error("Failed to add service to user cart", error);
            res.status(500).json({ message: "Failed to add service to user cart" });
        }
    },
    fetchUpdatedCart: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const cart = await cartInteractor.getUpdatedCart(id);
            res.status(200).json(cart);
        } catch (error) {
            console.error("Failed to add service to user cart", error);
            res.status(500).json({ message: "Failed to add service to user cart" });
        }
    },
    removeCartItemById: async (req: Request, res: Response) => {
        try {
            const { userId, serviceId } = req.body;
            await cartInteractor.removeCartItem(userId, serviceId);
            res.status(200).json();
        } catch (error) {
            console.error("Failed to remove service from user cart", error);
            res
                .status(500)
                .json({ message: "Failed to remove service from user cart" });
        }
    },
    updateCart: async (req: Request, res: Response) => {
        const { id } = req.params; // Ensure `id` is being passed correctly (userId)
        const { services }: { services: IServiceUpdate[] } = req.body;
        try {
            const cart = await Cart.findOne({ userId: id });
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }
            services.forEach((serviceUpdate: IServiceUpdate) => {
                const { serviceId, personIds } = serviceUpdate;
                if (!personIds || personIds.length === 0) {
                    return res
                        .status(400)
                        .json({ message: "No person IDs found for service" });
                }
                cart.services.forEach((cartService) => {
                    if (cartService.serviceId.toString() === serviceId.toString()) {
                        cartService.personIds = personIds.map((personId) => ({
                            _id: personId, // Assign the ObjectId
                            model: personId.toString() === id ? "User" : "Patient",
                        }));
                    }
                });
            });
            await cart.save();
            res.status(200).json(cart);
        } catch (error) {
            console.error("Error updating cart data:", error);
            res.status(500).json({ message: "Error updating cart data", error });
        }
    },
    clearCart: async (req: Request, res: Response) => {
        try {
            const { userId } = req.body;
            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }
            await cartInteractor.clearCart(userId);
            res.status(200).json({ message: "Cart cleared successfully" });
        } catch (error) {
            console.error("Error clearing cart:", error);
            res.status(500).json({ message: "Error clearing cart" });
        }
    },
}