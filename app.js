const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const tmi = require('tmi.js')
const _ = require('lodash')
const exec = require('child_process').exec

var routes = require('./routes/index')

var app = express()
// call socket.io to the app
app.io = require('socket.io')()

// view engine setup
app.set('views', path.join(__dirname, 'views'))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

let keymap = {
  'U': 'Up',
  'u': 'Up',
  'up': 'Up',
  'UP': 'Up',
  'Up': 'Up',
  '上': 'Up',
  'D': 'Down',
  'd': 'Down',
  'down': 'Down',
  'DOWN': 'Down',
  'Down': 'Down',
  '下': 'Down',
  'L': 'Left',
  'l': 'Left',
  'left': 'Left',
  'LEFT': 'Left',
  'Left': 'Left',
  '左': 'Left',
  'R': 'Right',
  'r': 'Right',
  'right': 'Right',
  'RIGHT': 'Right',
  '右': 'Right',
  'A': 'z',
  'a': 'z',
  'z': 'z',
  'Z': 'z',
  'B': 'x',
  'b': 'x',
  'X': 'x',
  'x': 'x'
}
let totCtrl = {
  'Up': 0,
  'Down': 0,
  'Left': 0,
  'Right': 0,
  'z': 0,
  'x': 0
}

let options = {
  options: {
    debug: true
  },
  connection: {
    reconnect: false
  },
  identity: {
    username: '',
    // https://twitchapps.com/tmi/
    password: ''
  },
  channels: ['#jd615645']
}
var client = new tmi.client(options)

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

let nowTime = 0
setInterval(() => {
  nowTime++
}, 1000)

let programName = 'VBA'
let windowID = 'unfilled'
if (windowID === 'unfilled') {
  exec('xdotool search --onlyvisible --name ' + programName, (err, stdout) => {
    windowID = stdout.trim()
    console.log(windowID)
  })
}

// start listen with socket.io
app.io.on('connection', (socket) => {
  client.addListener('message', (channel, user, msg, self) => {
    if (!_.isUndefined(keymap[msg])) {
      console.log(path.dirname(__filename))
      // 若要純node.js板程式可用這個
      // exec('xdotool windowfocus ' + windowID + ' key --delay 100 ' + keymap[msg])
      exec('python ' + path.dirname(__filename) + '/public/python/ctrl.py ' + keymap[msg])

      socket.emit('ctrl', {'nickname': user['display-name'], 'ctrl': keymap[msg]})
    }
  })
  client.connect()
  setInterval(() => {
    socket.emit('time', {'time': nowTime})
  }, 1000)

  socket.on('disconnect', function () {
    client.disconnect()
  })
})

module.exports = app
