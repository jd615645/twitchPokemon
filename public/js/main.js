$(document).ready(() => {
  let socket = io.connect()

  let hash = {
    'Up': '↑',
    'Down': '↓',
    'Left': '←',
    'Right': '→',
    'z': 'A',
    'x': 'B'
  }

  let list = []

  socket.on('ctrl', (data) => {
    let nickname = data.nickname
    let ctrl = data.ctrl

    $('.list ul').append('<li><div class="nickname">' + nickname + '</div><div class="ctrl">' + hash[ctrl] + '</div></li>')
  })

  socket.on('time', (data) => {
    let totTime = data.time

    let hr = (totTime - (totTime % 3600)) / 3600
    let min = ((totTime % 3600) - (totTime % 60)) / 60
    let sec = totTime % 60
    $('.hr').html(hr)
    $('.min').html(min)
    $('.sec').html(sec)
  })
})
