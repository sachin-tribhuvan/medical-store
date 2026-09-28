const router = require('express').Router();
const c = require('../controllers/medicineController');

router.get('/search', c.search); // must stay before /:id
router.get('/stats', c.stats);
router.route('/').get(c.list).post(c.create);
router.route('/:id').get(c.getOne).put(c.update).delete(c.remove);

module.exports = router;
