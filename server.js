const http = require('http')
const url = require('url')

const app = require('router')()

const bodyParser = require('body-parser')

// const io = require('./io')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
  req.query = url.parse(req.url, true).query
  let opts = (req.options = {
    url: req.body.$url || req.query.$url,
    reset_dcom: Boolean(req.body.$reset || req.query.$reset)
  })
  if (!opts.url) {
    return res.end('error')
  }
  next()
})
app.use((req, res, next) => {
  const io = require('./io')
  let clients = Object.values(io.clients().connected).filter(
    v => v.info && v.info.status === 'GOOD'
  )
  if (clients.length === 0) {
    return res.end('"no worker"')
  }

  let socket = clients.shift()
  console.log('123')

  socket.emit(
    'request',
    {
      method: req.method,
      opts: req.options,
      body: req.body,
      query: req.query,
      headers: req.headers
    },
    (err, payload) => {
      if (payload === null) return res.end('"ERROR"')
      let { headers, body, statusCode } = payload
      Object.keys(headers).map(k => (req.headers[k] = headers[k]))
      res.statusCode = statusCode

      res.end(body)
    }
  )
})

const finalhandler = require('finalhandler')

const server = http.Server((req, res) => {
  app(req, res, finalhandler(req, res))
})

server.listen(8000, () => {
  console.log('app started 8000')
})
module.exports = server
