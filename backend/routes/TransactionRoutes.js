const express = require("express");
const {
  getAllProductList,
  getQueryData,
  getStatistics,
  getPriceRangesChart,
  getCategories,
} = require("../controllers/TransctionControllers");

const router = express.Router();

router.route("/transactions").get(getAllProductList);
router.route("/transactions/quryresult").post(getQueryData);
router.route("/statistics/:month").get(getStatistics);
router.route("/getPriceRangesChart/:month").get(getPriceRangesChart);
router.route("/catagoryCount/:month").get(getCategories);

// combine data ( plz call 3 api at a time for perfect result)
// router.get("/combinedData/:year/:month", async (req, res) => {
//   const year = req.params.year;
//   const month = req.params.month;

//   try {
//     // Call the existing APIs and gather their responses
//     const statisticsResponse = await getStatistics(req, res);
//     const priceRangesResponse = await getPriceRangesChart(req, res);
//     const categoriesResponse = await getCategories(req, res);

//     // Combine the responses into a single JSON
//     const combinedResponse = {
//       statistics: statisticsResponse,
//       priceRanges: priceRangesResponse,
//       categories: categoriesResponse,
//     };

//     // Send the combined response as JSON
//     res.json(combinedResponse);
//   } catch (error) {
//     console.error("Error combining data:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

module.exports = router;
