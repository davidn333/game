//make websocket connection and recieve color

$(function () {
  var counter = 0;
  var window_width = window.innerWidth / 2;
  var window_size = window.innerHeight;
  var min = 50;
  var max = (window.innerWidth - 50) / 2;

  gap = Math.floor(Math.random() * Math.floor(max)); 

  const box = `<div id="mybox" class="bg-red absolute h3" style="width:${window_width};right:0px;top:${counter}px;"></div>`
  const boxtwo = `<div id="mybox2" class="bg-red absolute h3" style="width:${window_width};left:0px;top:${counter}px;"></div>`

  $('#playarea').append(box)
  $('#playarea').append(boxtwo)


  var mybox = $("#mybox");
  var myboxtwo = $("#mybox2");

  var moving = setInterval(move, 2);

  function move() {
    var args = `width: ${window_width - gap};left:0px;top:${counter}px;`;
    mybox.attr("style", args);

    var args = `width: ${window_width + (gap - 100)};right:0px;top:${counter}px;`;
    myboxtwo.attr("style", args);
    if (counter >= window_size - 64) {
      clearInterval(moving);
    }
    counter += 1;
  }




  const session = $('#playarea').data('session')
  //const ws = new WebSocket(`ws://10.218.4.227:3000`)// `` these back-ticks are for javascript interpolation
  const ws = new WebSocket(`ws://localhost:9292/socket/${session}`)

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
