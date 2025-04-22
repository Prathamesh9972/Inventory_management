const express = require("express");
const router = express.Router();
const {
  getChemicals,
  addChemical,
  getChemicalById,
  updateChemical,
  deleteChemical,
  searchChemicals,
} = require("../controllers/chemicalController");
const checkRole = require("../middlewares/roleMiddleware");

router.get("/", getChemicals);

router.get("/:id", getChemicalById);

router.post("/", checkRole, addChemical); // Only allow admin to add chemical

router.put("/:id", checkRole, updateChemical); // Only allow admin to update chemical

router.delete("/:id", checkRole, deleteChemical); // Only allow admin to delete chemical

router.get('/search', searchChemicals);


module.exports = router;
