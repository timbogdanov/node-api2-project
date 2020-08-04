const express = require('express');

const server = express();
const postsRouter = require('./routers/posts/posts-router');

server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
  res.send({ message: 'hello freaks' });
});

server.listen(8000, () => {
  console.log('server running on port 8000');
});
