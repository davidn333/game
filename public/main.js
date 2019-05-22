//make websocket connection and recieve color

$(function () {
  const box = `<div class="bg-red absolute h3 w3" style="left:400px;top:400px;"></div>`
  // using .append to add new boxes of randomly generated proportions to the viewspace
  $('#playarea').append(box)

  const session = $('#playarea').data('session')
  const ws = new WebSocket(`ws://10.218.4.227:3000`)// `` these back-ticks are for javascript interpolation
  let color

  const onDrag = (evt, ui) => {
    const {left, top} = ui.position
    const msg = [session, color, left, top].join("|")
    //can only send strings down a websocket, eg above = c973a|301|29
    ws.send(msg)//<---how to send message up to server
  }

  ws.onmessage = (msg) => {  //ws = the web socket connection, onmessage is saying what to do in this event
    if (!color) {
      color = msg.data
      $(`#${session}`).addClass(color).draggable({
        drag: onDrag})
        }
    else{
      const [_session, color, left, top] = msg.data.split("|")
      const inDom = $(`#${_session}`).size()

      if (inDom){
        $(`#${_session}`).attr("style", `left:${left}px;top:${top}px;`)
      }
      else {
        const ball = `<div id="${_session}" class="absolute h3 w3 br-100 ${color}" style="left:${left}px;top:${top}px;"></div>`
        $('#playarea').append(ball)
      }

    }
  }

})
