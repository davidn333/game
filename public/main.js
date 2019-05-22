//make websocket connection and recieve color

$(function () {
  var counter = 0;
  var window_size = window.innerHeight;

  console.log(window);
  const box = `<div id="mybox" class="bg-red absolute h3 w3" style="left:400px;top:${counter}px;"></div>`
  $('#playarea').append(box)

  var mybox = $("#mybox");
  var moving = setInterval(move, 50);

  function move() {
    var args = `left:400px;top:${counter}px;`;
    mybox.attr("style", args);
    counter += 40;
    if (counter > window_size - 50) {
      clearInterval(moving);
    }
  }



  const session = $('#playarea').data('session')
  //const ws = new WebSocket(`ws://10.218.4.227:3000`)// `` these back-ticks are for javascript interpolation
  const ws = new WebSocket(`ws://10.218.4.227:3000/socket/${session}`)

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
