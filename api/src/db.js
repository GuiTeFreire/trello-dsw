import { connect } from 'mongoose';
require('dotenv').config();

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/trello-dsw';

connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));
