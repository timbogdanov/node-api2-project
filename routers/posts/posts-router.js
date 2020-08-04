const router = require('express').Router();
const Posts = require('../../data/db');

router.post('/', (req, res) => {
  try {
    if (req.body.title && req.body.contents) {
      Posts.insert(req.body)
        .then((post) => res.status(201).json(post))
        .catch((error) => console.log(error));
    } else {
      res.status(400).json({
        error: 'Please provide title and contents for the post.',
      });
    }
  } catch (error) {
    res.status(500).json({
      error:
        'There was an error while saving the post to the database',
    });
  }
});

router.post('/:id/comments', (req, res) => {
  const id = req.params.id;
  try {
    if (id) {
      if (req.body.text) {
        req.body.post_id = id;

        Posts.insertComment(req.body)
          .then((comment) => {
            Posts.findCommentById(comment.id).then((newComment) => {
              res.status(201).json({ data: newComment });
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        res.status(400).json({
          errorMessage: 'Please provide text for the comment.',
        });
      }
    } else {
      res.status(404).json({
        error: 'The post with the specified ID does not exist.',
      });
    }
  } catch (error) {
    res.status(500).json({
      error:
        'There was an error while saving the comment to the database',
    });
  }
});

router.get('/', (req, res) => {
  Posts.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(500).json({
        error: 'The posts information could not be retrieved.',
      });
    });
});

module.exports = router;
