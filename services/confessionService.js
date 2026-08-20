const allowedCategories = ['bug', 'deadline', 'imposter', 'vibe-code']
const confessions = []
let nextConfessionId = 0

function validateConfessionInput(confessionData) {
  if (!confessionData) return { valid: false, response: { status: 400, body: { msg: 'bad' } } }
  if (!confessionData.text) return { valid: false, response: { status: 400, body: { msg: 'need text' } } }
  if (confessionData.text.length >= 500) {
    return { valid: false, response: { status: 400, body: { error: 'text too big, must be less than 500 characters long buddy' } } }
  }
  if (confessionData.text.length <= 0) return { valid: false, response: { status: 400, body: 'too short' } }
  if (!allowedCategories.includes(confessionData.category)) {
    return { valid: false, response: { status: 400, body: 'category not in stuff' } }
  }
  return { valid: true }
}

function saveConfession(confessionData) {
  const confession = {
    id: ++nextConfessionId,
    text: confessionData.text,
    category: confessionData.category,
    created_at: new Date()
  }
  confessions.push(confession)
  console.log(`added one info ${confession.id}`)
  return confession
}

function formatConfessionResponse(confession) {
  if (!confession.text) throw new Error('Confession has no text')
  console.log(`found info with ${confession.text.length} chars`)
  return confession
}

function listConfessions() {
  const sortedConfessions = [...confessions].sort((first, second) => second.created_at - first.created_at)
  console.log('fetching all data result')
  return { data: sortedConfessions, count: sortedConfessions.length }
}

function findConfessionById(confessionId) {
  return confessions.find(confession => confession.id === confessionId)
}

function listConfessionsByCategory(category) {
  if (!allowedCategories.includes(category)) return null
  return confessions.filter(confession => confession.category === category).reverse()
}

function deleteConfessionById(confessionId) {
  const confessionIndex = confessions.findIndex(confession => confession.id === confessionId)
  if (confessionIndex === -1) return null
  const deletedConfessions = confessions.splice(confessionIndex, 1)
  console.log('deleted something')
  return deletedConfessions[0]
}

module.exports = {
  allowedCategories,
  validateConfessionInput,
  saveConfession,
  formatConfessionResponse,
  listConfessions,
  findConfessionById,
  listConfessionsByCategory,
  deleteConfessionById
}
