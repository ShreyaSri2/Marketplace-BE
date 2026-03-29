import { Request, Response } from "express";
import { getAllItems } from "../services/item.service";
import Item from "../models/item.model";

export const fetchDashboard = async (req: any, res: Response) => {
  try {
    //const data = await getAllItems(req.query, req.user.userId);
    //const data = await getAllItems(req.query);

    const userId = req.user.userId;
    const data = await getAllItems(req.query, userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createItem = async (req: any, res: Response) => {
  try {
    const item = await Item.create({
      ...req.body,
      seller: req.user.userId,
      createdBy: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const updateItem = async (req: any, res: any) => {
//   try {
//     const { id } = req.params;
//     const userId = req.query.userid;

//     const item = await Item.findById(id);

//     if (!item || item.isDeleted) {
//       return res.status(404).json({ message: 'Item not found' });
//     }

//     if (item.createdBy.toString() !== userId) {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }

//     Object.assign(item, req.body);
//     await item.save();

//     res.json({ success: true, data: item });
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };


export const updateItem = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const item = await Item.findById(id);

    if (!item || item.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    Object.assign(item, req.body);
    await item.save();

    return res.json({
      success: true,
      data: item,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteItem = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // ✅ AUTH FIX
    if (item.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    item.isDeleted = true;
    await item.save();

    return res.json({
      success: true,
      message: "Item deleted",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// export const deleteItem = async (req: any, res: any) => {
//   try {
//     const { id } = req.params;
//     const userId = req.query.userid;

//     const item = await Item.findById(id);

//     if (!item) {
//       return res.status(404).json({ message: 'Item not found' });
//     }

//     if (item.createdBy.toString() !== userId) {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }

//     item.isDeleted = true;
//     await item.save();

//     res.json({ success: true, message: 'Item deleted' });
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };