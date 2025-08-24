const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello from Edutwin Backend!');
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
