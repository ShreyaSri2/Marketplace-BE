import { Request, Response } from "express";
import Transaction from '../models/transaction.model';
import Item from '../models/item.model';

export const createTransaction = async (req: any, res: any) => {
  try {
    const { itemId, type } = req.body;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.createdBy.toString() === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot buy your own item",
      });
    }

    const transaction = await Transaction.create({
      item: itemId,
      buyer: req.user.userId,         
      seller: item.createdBy,         
      type,                           
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTransactions = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;

    const transactions = await Transaction.find({
      $or: [
        { buyer: userId },
        { seller: userId }
      ]
    }).populate("item");

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTransaction = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { status } = req.body;

    const allowedStatuses = ["pending", "completed", "rejected", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const buyerId = transaction.buyer.toString();
    const sellerId = transaction.seller.toString();

    if (userId !== buyerId && userId !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (userId === buyerId) {
      if (status !== "cancelled") {
        return res.status(403).json({
          success: false,
          message: "Buyer can only cancel the transaction",
        });
      }
    }

    if (userId === sellerId) {
      if (!["completed", "rejected"].includes(status)) {
        return res.status(403).json({
          success: false,
          message: "Seller can only complete or reject the transaction",
        });
      }
    }

    if (["completed", "rejected", "cancelled"].includes(transaction.status)) {
      return res.status(400).json({
        success: false,
        message: "Transaction already finalized",
      });
    }

    transaction.status = status;
    await transaction.save();

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: transaction,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};