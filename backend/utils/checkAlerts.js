const Chemical = require('../models/chemicalModel')

// Configurable thresholds
const LOW_STOCK_THRESHOLD = 20
const EXPIRY_WINDOW_DAYS = 30

const checkAlerts = async () => {
  const now = new Date()
  const nearExpiryDate = new Date()
  nearExpiryDate.setDate(now.getDate() + EXPIRY_WINDOW_DAYS)

  try {
    const lowStock = await Chemical.find({ quantity: { $lt: LOW_STOCK_THRESHOLD } })
    const expiring = await Chemical.find({
      expirationDate: { $gte: now, $lte: nearExpiryDate }
    })

    return {
      lowStock,
      expiring
    }
  } catch (error) {
    console.error('Alert check failed:', error.message)
    throw error
  }
}

module.exports = checkAlerts
