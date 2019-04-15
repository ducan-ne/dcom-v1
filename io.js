const io = require('socket.io')(require('./server'))
// const pool = require('./pool')

io.use((socket, next) => {
  let clientId = socket.handshake.headers['x-clientid']
  if (clientId === '_SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED') {
    return next()
  }
  return next(new Error('authentication error'))
})

io.on('connection', socket => {
  console.log('connected')
  // pool.add(socket, 1)
  socket.info = {}

  // socket.on('disconnect', () => pool.remove(v => v.id === socket.id))
  socket.on('info', info => {
    for (let k in info) {
      socket.info[k] = info[k]
    }
  })
})

module.exports = io
