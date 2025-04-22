const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
require('dotenv').config()

const app = express()

// Connect to database
connectDB()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/chemicals', require('./routes/chemicalRoutes'))
app.use('/api/purchases', require('./routes/purchaseRoutes'))
app.use('/api/sales', require('./routes/salesRoutes'))
app.use('/api/safety', require('./routes/safetyRoutes'))
app.use('/api/alerts', require('./routes/alertRoutes'))
app.use('/api/reports', require('./routes/reportRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' })
})
