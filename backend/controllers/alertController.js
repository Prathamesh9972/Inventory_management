const Chemical = require('../models/chemicalModel')

const getAlerts = async (req, res) => {
  try {
    const now = new Date()
    const soon = new Date()
    soon.setDate(soon.getDate() + 30)

    const lowStock = await Chemical.find({ quantity: { $lt: 20 } }) // threshold: 20
    const expiring = await Chemical.find({ expirationDate: { $lte: soon, $gte: now } })

    res.status(200).json({ lowStock, expiring })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' })
  }
}

module.exports = { getAlerts }
