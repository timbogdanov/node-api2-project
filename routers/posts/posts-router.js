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
              res.status(201).json(newComment);
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

router.get('/:id', (req, res) => {
  const id = req.params.id;
  try {
    Posts.findById(id)
      .then((post) => {
        res.status(200).json(post);
      })
      .catch((error) => {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.',
        });
      });
  } catch (error) {
    res.status(500).json({
      error: 'The post information could not be retrieved.',
    });
  }
});

router.get('/:id/comments', (req, res) => {
  const id = req.params.id;

  try {
    Posts.findPostComments(id)
      .then((comments) => {
        console.log(comments);
        res.status(200).json(comments);
      })
      .catch((error) => {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.',
        });
      });
  } catch (error) {
    res.status(500).json({
      error: 'The comments information could not be retrieved.',
    });
  }
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  try {
    Posts.remove(id)
      .then((post) => {
        res.status(200).json({ message: `delete a post ${post}` });
      })
      .catch((error) => {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.',
        });
      });
  } catch (error) {
    res.status(500).json({ error: 'The post could not be removed' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const id = req.params.id;

    if (id) {
      if (req.body.title && req.body.contents) {
        Posts.update(id, req.body)
          .then((updatedPost) => {
            res.status(200).json(updatedPost);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        res.status(400).json({
          error: 'Please provide title and contents for the post.',
        });
      }
    } else {
      res.status(404).json({
        error: 'The post with the specified ID does not exist.',
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'The post information could not be modified.' });
  }
});

module.exports = router;
