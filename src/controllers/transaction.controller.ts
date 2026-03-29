import { Request, Response } from "express";
import Transaction from '../models/transaction.model';
import Item from '../models/item.model';

// export const createTransaction = async (req: any, res: any) => {
//   try {
//     const { itemId, type } = req.body;
//     const buyerId = req.user.userid;

//     const item = await Item.findById(itemId);

//     if (!item || item.isSold) {
//       return res.status(400).json({ message: 'Item not available' });
//     }

//     if (item.createdBy.toString() === buyerId) {
//       return res.status(400).json({ message: 'Cannot buy your own item' });
//     }

//     const transaction = await Transaction.create({
//       item: itemId,
//       buyer: buyerId,
//       seller: item.createdBy,
//       type,
//     });

//     res.json({ success: true, data: transaction });
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const createTransaction = async (req: any, res: any) => {
//   try {
//     const { itemId, type } = req.body;

//     const transaction = await Transaction.create({
//       item: itemId,
//       buyer: req.user.userId, // ✅ FIX
//       type, // ✅ must be valid enum
//       status: "pending",
//     });

//     return res.status(201).json({
//       success: true,
//       data: transaction,
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const createTransaction = async (req: any, res: any) => {
  try {
    const { itemId, type } = req.body;

    // ✅ 1. Get item
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // ✅ 2. Prevent self-buy
    if (item.createdBy.toString() === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot buy your own item",
      });
    }

    // ✅ 3. Create transaction
    const transaction = await Transaction.create({
      item: itemId,
      buyer: req.user.userId,         // ✅ logged-in user
      seller: item.createdBy,         // ✅ item owner
      type,                           // ✅ buy / trade
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

// export const getTransactions = async (req: any, res: any) => {
//   try {
//     const userId = req.query.userid;

//     const transactions = await Transaction.find({
//       $or: [{ buyer: userId }, { seller: userId }],
//     }).populate('item');

//     res.json({ success: true, data: transactions });
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };

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

// export const updateTransaction = async (req: any, res: any) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
//     const userId = req.query.userid;

//     const transaction = await Transaction.findById(id);

//     if (!transaction) {
//       return res.status(404).json({ message: 'Not found' });
//     }

//     if (
//       transaction.buyer.toString() !== userId &&
//       transaction.seller.toString() !== userId
//     ) {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }

//     transaction.status = status;

//     if (status === 'COMPLETED') {
//       await Item.findByIdAndUpdate(transaction.item, { isSold: true });
//     }

//     await transaction.save();

//     res.json({ success: true, data: transaction });
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const updateTransaction = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { status } = req.body;

    // ✅ 1. Validate status input
    const allowedStatuses = ["pending", "completed", "rejected", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // ✅ 2. Find transaction
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const buyerId = transaction.buyer.toString();
    const sellerId = transaction.seller.toString();

    // ✅ 3. Authorization check (must be buyer or seller)
    if (userId !== buyerId && userId !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ✅ 4. STRICT ROLE-BASED CONTROL

    // 👉 Buyer rules
    if (userId === buyerId) {
      if (status !== "cancelled") {
        return res.status(403).json({
          success: false,
          message: "Buyer can only cancel the transaction",
        });
      }
    }

    // 👉 Seller rules
    if (userId === sellerId) {
      if (!["completed", "rejected"].includes(status)) {
        return res.status(403).json({
          success: false,
          message: "Seller can only complete or reject the transaction",
        });
      }
    }

    // ✅ 5. Prevent updating already finalized transactions
    if (["completed", "rejected", "cancelled"].includes(transaction.status)) {
      return res.status(400).json({
        success: false,
        message: "Transaction already finalized",
      });
    }

    // ✅ 6. Update status
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