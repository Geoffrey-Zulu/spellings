const express = require('express');
const bodyParser = require('body-parser');
const pollyRoute = require('./routes/polly');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const wordEntryRoute = require('./routes/wordEntry');
const batchPollyRoute = require('./routes/batchPolly');
const todayEntryRoute = require('./routes/todayEntry');
const audioRoutes = require('./routes/audioRoutes');
const cron = require('node-cron');
const axios = require('axios');
const cors = require('cors');


const app = express();
app.use(cors());
const PORT = 3001;

require('dotenv').config();
app.use(bodyParser.json());

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);


// Routes
app.use('/api/polly', pollyRoute);
app.use('/api/auth', registerRoute);
app.use('/api/auth', loginRoute);
app.use('/api/words', wordEntryRoute);
app.use('/api/polly', batchPollyRoute);
app.use('/api/today', todayEntryRoute);
app.use('/api/today', audioRoutes);

// Scheduler to run daily at 23:00
cron.schedule('0 23 * * *', async () => {
    try {
      await axios.post('http://localhost:3001/api/polly/synthesize-tomorrow');
      console.log('Daily audio synthesis completed.');
    } catch (error) {
      console.error('Error running daily audio synthesis:', error);
    }
  });

  // Scheduler to run daily at 00:00 for fetching today's entry
cron.schedule('0 0 * * *', async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/today/today');
      console.log('Fetched today\'s entry:', response.data);
    } catch (error) {
      console.error('Error fetching today\'s entry:', error);
    }
  });