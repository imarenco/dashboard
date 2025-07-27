const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sales-analytics', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.get('/api/transactions', async (req, res) => {
  try {
    const { customerName } = req.query;
    let query = {};
    
    if (customerName) {
      query.customerName = { $regex: customerName, $options: 'i' };
    }
    
    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const { customerName, amount, currency } = req.body;
    
    if (!customerName || !amount) {
      return res.status(400).json({ error: 'Customer name and amount are required' });
    }

    const transaction = new Transaction({
      customerName,
      amount: parseFloat(amount),
      currency: currency || 'USD'
    });

    const savedTransaction = await transaction.save();
    
    // Emit real-time update to all connected clients
    io.emit('newTransaction', savedTransaction);
    
    // Calculate and emit updated analytics
    const totalRevenue = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    io.emit('analyticsUpdate', {
      totalRevenue: totalRevenue[0]?.total || 0
    });

    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

app.get('/api/analytics', async (req, res) => {
  try {
    const totalRevenue = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    res.json({
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 