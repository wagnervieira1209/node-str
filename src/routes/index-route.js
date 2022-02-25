'use strict'

const express = require('express');
const router = express.Router();

// Criando rota default para testar se está funcionando
router.get('/', (req, res, next) => {
    res.status(200).send({
        title: "Node Store API - Wagner Vieira",
        version: "0.0.1"
    });
});

module.exports = router;