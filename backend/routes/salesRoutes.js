const express = require('express')
const router = express.Router()
const {
  addSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale
} = require('../controllers/salesController')

router.post('/', addSale)

router.get('/', getAllSales)

router.get('/:id', getSaleById)

router.put('/:id', updateSale)

router.delete('/:id', deleteSale)

module.exports = router
