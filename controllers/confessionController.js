const confessionService = require('../services/confessionService')

function createConfession(req, res) {
  const validation = confessionService.validateConfessionInput(req.body)
  if (!validation.valid) return res.status(validation.response.status).send(validation.response.body)

  const confession = confessionService.saveConfession(req.body)
  return res.status(201).json(confession)
}

function getAllConfessions(req, res) {
  return res.json(confessionService.listConfessions())
}

function getConfessionById(req, res) {
  const confessionId = Number.parseInt(req.params.id, 10)
  const confession = confessionService.findConfessionById(confessionId)
  if (!confession) return res.status(404).json({ msg: 'not found' })

  try {
    return res.json(confessionService.formatConfessionResponse(confession))
  } catch (error) {
    return res.status(500).send('broken')
  }
}

function getConfessionsByCategory(req, res) {
  const categoryConfessions = confessionService.listConfessionsByCategory(req.params.cat)
  if (!categoryConfessions) return res.status(400).json({ msg: 'invalid category' })
  return res.json(categoryConfessions)
}

function deleteConfession(req, res) {
  if (req.headers['x-delete-token'] !== process.env.DELETE_TOKEN) {
    return res.status(403).json({ msg: 'no permission' })
  }
  if (!req.params.id) return res.status(400).send('no id')

  const confession = confessionService.deleteConfessionById(Number.parseInt(req.params.id, 10))
  if (!confession) return res.status(404).json({ msg: 'not found buddy' })
  return res.json({ msg: 'ok', item: confession })
}

module.exports = {
  createConfession,
  getAllConfessions,
  getConfessionById,
  getConfessionsByCategory,
  deleteConfession
}
