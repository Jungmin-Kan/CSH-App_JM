const express = require('express');
const app = express();
app.use(express.json());

app.use('/User',require('./routes/user-routes'))
app.use('/Restaurant',require('./routes/res-routes'))
app.use('/File',require('./routes/file-routes'))

app.listen(3001, () => { console.log('open expo notification server');})

