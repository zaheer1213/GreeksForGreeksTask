const Transaction = require("../models/TransactionModel");
const axios = require("axios");
const Comman = require("../commanconsts/Comman");
const Fuse = require("fuse.js");

// get all product list from third party API
exports.getAllProductList = async (req, res) => {
  try {
    const { month } = req.body;
    if (!month) {
      return res
        .status(400)
        .json({ success: false, message: "Month parameter is required" });
    }
    const response = await axios.get(Comman.THIRDPARTYAPIURL, {
      params: {
        month: month,
      },
    });

    const data = response.data;
    await Transaction.insertMany(data);
    return res
      .status(200)
      .json({ success: true, message: "Database initialized successfully" });
  } catch (error) {
    console.error("Failed to initialize the database", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// get transaction data using pagination and search query
exports.getQueryData = async (req, res) => {
  try {
    const { page = 1, perPage = 10, search = "" } = req.body;

    const isPriceSearch = !isNaN(parseFloat(search)) && isFinite(search);

    // Get all transactions without pagination for Fuse.js search
    const allTransactions = await Transaction.find();

    // Create a dynamic query based on title, description, and price for MongoDB search
    const mongoDBQuery = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

    // Include the "price" field in the search only if it's a valid number
    if (isPriceSearch) {
      mongoDBQuery.$or.push({ price: parseFloat(search) });
    }

    // Use Fuse.js for fuzzy searching
    const fuse = new Fuse(allTransactions, {
      keys: ["title", "description","price"],
      threshold: 0.3, // Adjust the threshold based on your preference
    });

    const fuzzySearchResults = fuse.search(search);

    // Extract conditions for Fuse.js results
    const fuseConditions = fuzzySearchResults.map((result) => ({
      _id: result.item._id,
    }));

    // Combine MongoDB query and Fuse.js results
    const combinedQuery = {
      $or: [...mongoDBQuery.$or, ...fuseConditions],
    };

    const transactions = await Transaction.find(combinedQuery)
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// API for statistics
exports.getStatistics = async (req, res) => {
  const monthsMap = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const selectedMonthName = req.params.month;
  const selectedMonth = monthsMap[selectedMonthName];

  if (!selectedMonth) {
    return res.status(400).json({ error: "Invalid month name" });
  }

  try {
    const allYearsData = await Transaction.find({
      dateOfSale: {
        $gte: new Date(0), // Start of time
      },
    });

    const monthlyData = allYearsData.filter((product) => {
      const productMonth = product.dateOfSale.getMonth() + 1; // getMonth is zero-based
      return productMonth === selectedMonth;
    });

    const totalSoldItemsCount = monthlyData.filter(
      (product) => product.sold
    ).length;

    const totalUnsoldItemsCount = monthlyData.filter(
      (product) => !product.sold
    ).length;

    const totalSoldItemsPrice = monthlyData.reduce((total, product) => {
      return total + (product.sold ? parseFloat(product.price) : 0);
    }, 0);

    // Round the totalSoldItemsPrice to 2 decimal places
    const roundedTotalSoldItemsPrice =
      Math.round(totalSoldItemsPrice * 100) / 100;
    res.json({
      totalSoldItemsCount,
      totalUnsoldItemsCount,
      totalSoldItemsPrice: roundedTotalSoldItemsPrice,
    });
  } catch (error) {
    console.error("Error retrieving data from the database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const monthsMap = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};
// api for price range
exports.getPriceRangesChart = async (req, res) => {
  const selectedMonthName = req.params.month;
  const selectedMonth = monthsMap[selectedMonthName];

  if (!selectedMonth) {
    return res.status(400).json({ error: "Invalid month name" });
  }

  try {
    // Use Mongoose query to retrieve data
    const selectedData = await Transaction.find({
      dateOfSale: {
        $gte: new Date(2000, selectedMonth - 1, 1), // A year with a leap year
        $lt: new Date(2030, selectedMonth, 1), // A future year
      },
    });

    // Initialize price range counts
    const priceRanges = {
      "0-100": 0,
      "101-200": 0,
      "201-300": 0,
      "301-400": 0,
      "401-500": 0,
      "501-600": 0,
      "601-700": 0,
      "701-800": 0,
      "801-900": 0,
      "901-above": 0,
    };

    // Count items in each price range
    selectedData.forEach((product) => {
      const price = product.price;
      if (price >= 0 && price <= 100) {
        priceRanges["0-100"]++;
      } else if (price <= 200) {
        priceRanges["101-200"]++;
      } else if (price <= 300) {
        priceRanges["201-300"]++;
      } else if (price <= 400) {
        priceRanges["301-400"]++;
      } else if (price <= 500) {
        priceRanges["401-500"]++;
      } else if (price <= 600) {
        priceRanges["501-600"]++;
      } else if (price <= 700) {
        priceRanges["601-700"]++;
      } else if (price <= 800) {
        priceRanges["701-800"]++;
      } else if (price <= 900) {
        priceRanges["801-900"]++;
      } else {
        priceRanges["901-above"]++;
      }
    });
    res.json(priceRanges);
  } catch (error) {
    console.error("Error retrieving data from the database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// api for pie chart
exports.getCategories = async (req, res) => {
  const selectedMonthName = req.params.month;
  if (!selectedMonthName) {
    return res.status(400).json({ error: "Invalid month name" });
  }
  const selectedMonth = monthsMap[selectedMonthName];
  try {
    const selectedData = await Transaction.find({
      dateOfSale: {
        $gte: new Date(2000, selectedMonth - 1, 1), // A year with a leap year
        $lt: new Date(2030, selectedMonth, 1), // A future year
      },
    });
    const catagoryCount = {};
    selectedData.forEach((row) => {
      const catagory = row.category;
      if (catagory) {
        catagoryCount[catagory] = (catagoryCount[catagory] || 0) + 1;
      }
    });
    const result = Object.entries(catagoryCount).map(([category, count]) => ({
      category,
      count,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
