const express = require('express');
const router  = express.Router();

const { authMiddleware, requireRole } = require('../middlewares/auth');


const authCtrl         = require('../controllers/authController');
const signalementsCtrl = require('../controllers/signalementsController');
const enqueteursCtrl   = require('../controllers/enqueteursController');
const suspectsCtrl     = require('../controllers/suspectsController');
const preuvesCtrl      = require('../controllers/preuvesController');
const dashboardCtrl    = require('../controllers/dashboardController');



router.post('/login', authCtrl.login);
router.get ('/profil', authMiddleware, authCtrl.getProfil);

router.get('/signalements/suivi/:code', signalementsCtrl.getBySuivi);


router.get   ('/signalements',         authMiddleware, signalementsCtrl.getAll);
router.get   ('/signalements/:id',     authMiddleware, signalementsCtrl.getById);
router.post  ('/signalements',            signalementsCtrl.create);   
router.patch ('/signalements/:id/statut', authMiddleware, signalementsCtrl.updateStatut);
router.delete('/signalements/:id',        authMiddleware, requireRole('SUPER_ADMIN'), signalementsCtrl.remove);


router.get   ('/enqueteurs',     authMiddleware, requireRole('SUPER_ADMIN', 'SUPERVISEUR'), enqueteursCtrl.getAll);
router.get   ('/enqueteurs/:id', authMiddleware, enqueteursCtrl.getById);
router.post  ('/enqueteurs',     authMiddleware, requireRole('SUPER_ADMIN'), enqueteursCtrl.create);
router.patch ('/enqueteurs/:id', authMiddleware, requireRole('SUPER_ADMIN'), enqueteursCtrl.update);
router.delete('/enqueteurs/:id', authMiddleware, requireRole('SUPER_ADMIN'), enqueteursCtrl.remove);


router.get ('/suspects',                     authMiddleware, suspectsCtrl.getAll);
router.get ('/suspects/:id',                 authMiddleware, suspectsCtrl.getById);
router.post('/suspects',                     authMiddleware, suspectsCtrl.create);
router.post('/suspects/:id/lier-signalement',   authMiddleware, suspectsCtrl.lierSignalement);


router.get  ('/preuves',           authMiddleware, preuvesCtrl.getAll);
router.post ('/preuves',           authMiddleware, preuvesCtrl.upload.single('fichier'), preuvesCtrl.create);
router.patch('/preuves/:id/valider', authMiddleware, requireRole('SUPER_ADMIN', 'SUPERVISEUR'), preuvesCtrl.valider);


router.get('/dashboard/stats', authMiddleware, dashboardCtrl.getStats);

module.exports = router;