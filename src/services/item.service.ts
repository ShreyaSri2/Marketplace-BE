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

  const filter: any = {
    seller: { $ne: userId }, // exclude current user
  };

  // 🔍 Search
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  // 🎯 Filters
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // 📊 Pagination
  const skip = (Number(page) - 1) * Number(limit);

  // ↕ Sorting
  const sortOptions: any = {
    [sortBy]: order === "asc" ? 1 : -1,
  };

  const [items, total] = await Promise.all([
    Item.find(filter)
      .populate("seller", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit)),

    Item.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};