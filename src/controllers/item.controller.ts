import { Request, Response } from "express";
import { getAllItems } from "../services/item.service";
import Item from "../models/item.model";

export const fetchDashboard = async (req: any, res: Response) => {
  try {
    //const data = await getAllItems(req.query, req.user.userId);
    //const data = await getAllItems(req.query);

    const userId = req.query.userId;
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
    const item = await Item.create(req.body);

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