import Item from "../models/item.model";

export const getAllItems = async (query: any, userId: string) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    order = "desc",
  } = query;

  const pageNumber = Math.max(1, Number(page));
  const limitNumber = Math.max(1, Number(limit));

  const filter: any = {
    createdBy: { $ne: userId }, 
    isSold: false,
  };

  if (search) {
    //filter.name = { $regex: search, $options: "i" };
    filter.$or = [
      {name: { $regex: search, $options: "i"}},
      {description: { $regex: search, $options: "i"}},
    ];
  }

  if (category) filter.category = category;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const skip = (pageNumber - 1) * limitNumber;

  const allowedSortFields = ["price", "createdAt", "name"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

  const sortOptions: any = {
    [sortField]: order === "asc" ? 1 : -1,
  };

  const [items, total] = await Promise.all([
    Item.find(filter)
      .populate("createdBy", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber),

    Item.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};