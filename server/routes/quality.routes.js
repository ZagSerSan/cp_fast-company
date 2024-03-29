const express = require('express')
const Quality = require('../models/Quality')
const router = express.Router({mergeParams: true})

// /api/quality
router.get('/', async (req, res) => {
  try {
    const list = await Quality.find()
    res.status(200).send(list)
  } catch (e) {
    res.status(500).json({
      message: 'На сервере проихошла ошибка, попробуйте позже.'
    })
  }
})

module.exports = router
