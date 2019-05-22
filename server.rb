require "sinatra"
require "sinatra-websocket"

class Server < Sinatra::Base
  enable :sessions
  set :colors, ["bg-pink", "bg-dark-pink", "bg-light-green", "bg-light-blue", "bg-purple", "bg-orange"]
  set :sockets, Array.new

  get "/" do
    erb :index, :locals => {session: session.id}
  end

  get "/socket/:session" do |session|
    request.websocket do |ws| #|ws| is the instance of client's websocket
      ws.onopen do    #onpen fires when a new client connects
        color = settings.colors[settings.sockets.count]
        settings.sockets << ws
        ws.send(color)
      end

      ws.onmessage do |msg|
        EM.next_tick{settings.sockets.each{|socket| socket.send(msg)}}#EM event machine basically ques the messages, revieves the message then sends message
      end

      ws.onclose do
        settings.sockets.delete(ws)
      end
    end
  end

end
