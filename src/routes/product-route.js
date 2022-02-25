'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/product-controller');
const authService = require('../services/auth-service');

router.get('/', controller.get);
router.get('/:slug', controller.getBySlug);
//router.get('/:id', controller.getById); // Conflito com a mesma rota do Slug
router.get('/ById/:id', controller.getById);
router.get('/ByTag/:tag', controller.getByTag);
router.post('/', authService.isAdmin, controller.post); // isAdmin -> Permite somente usuários tipo Admin
router.put('/:id', authService.isAdmin, controller.put);
router.delete('/:id', authService.isAdmin, controller.delete);

module.exports = router;