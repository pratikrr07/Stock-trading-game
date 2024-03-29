const playersRoute = require('./routes/players');
const adminRoutes = require('./routes/admin');


const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/players', playersRoute);
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
  res.send('Stock Trading Game API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;