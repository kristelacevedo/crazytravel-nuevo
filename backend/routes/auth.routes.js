const express = require('express');
const router = express.Router();

// Ruta de registro
router.post('/register', (req, res) => {
    res.json({ message: 'Ruta de registro funcionando', body: req.body });
});

// Ruta de login
router.post('/login', (req, res) => {
    res.json({ message: 'Ruta de login funcionando', email: req.body.email });
});

// Exportar el router correctamente
module.exports = router;