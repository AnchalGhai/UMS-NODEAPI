const express = require('express');
const router = express.Router();

const professorController = require('../controllers/professorController'); 
//console.log('professorController:', professorController); 

router.get('/', professorController.getAllProfessors);
router.get('/:id', professorController.getProfessorById);
router.post('/', professorController.addProfessor);
router.put('/:id', professorController.updateProfessor);
router.delete('/:id', professorController.deleteProfessor);


module.exports = router;
