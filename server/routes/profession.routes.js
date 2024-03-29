const express = require('express')
const Profession = require('../models/Profession')
const router = express.Router({mergeParams: true})

// /api/profession
router.get('/', async (req, res) => {
  try {
    const list = await Profession.find()
    res.status(200).send(list)
  } catch (e) {
    res.status(500).json({
      message: 'На сервере проихошла ошибка, попробуйте позже.'
    })
  }
})

module.exports = router
