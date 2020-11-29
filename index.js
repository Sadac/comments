const express = require('express');
const bodyParser = require('body-parser'); // eslint-disable-line
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', async (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  // every comment is created by default with status = pending
  comments.push({ id: commentId, content, status: 'pending' });

  commentsByPostId[req.params.id] = comments;

  // emit an event whenever a comment is being created and send it to event-bus service
  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending',
    },
  });

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  console.log('Recevied Event: ', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const {
      postId, id, status, content,
    } = data;
    const comments = commentsByPostId[postId];

    // find the comment and update its status
    const comment = comments.find((comm) => comm.id === id);
    comment.status = status;

    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log('COMMENTS_SERVICE: Listening on port 4001');
});
