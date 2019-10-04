var io = require("socket.io-client")
var socket = io("https://bonzi.dega.io/")
socket.emit('login',{name:'b!help'})
socket.on('reconnected',reconnected)
var reconnected = function(){
    var socket = io("https://bonzi.dega.io/")
    socket.emit('login',{name:'b!help'})
    socket.on('talk',function(data){
        var text = data.text
        if(text.startsWith('b!')){
            text = text.slice(2)
            var cmd = text.split(' ')[0]
            var oth = text.slice(cmd.length+1)
            if(Object.keys(commands).includes(cmd)){
                var command = commands[cmd](oth)
                setTimeout(function(){
                    socket.emit('talk',{text:command})
                },100)
            }
        }
    })
    socket.on('reconnected',reconnected)
}
var cool = false;
var sockets = []
var commands = {
    help:function(){
        return "<h3>Commands</h3>b!help, b!echo [text], b!join [user], b!burn, b!drunk [text], b!clickbait [text]"
    },
    echo(txt){
        if(txt.startsWith('b!')){
            return 'hahahaha nice joke lmao hahaha fuck you'
        }
        return txt
    },
    join(txt){
        if(cool){
            return "On cooldown!"
        }else{
            if(sockets.length > 10) return "Too much users."
            var sock = io("https://bonzi.dega.io/")
            sock.emit('login',{name:txt})
            sockets.push(sock)
            cool = true
            setTimeout(function(){
                cool = false
            },5000)
        }
    },
    burn(){
        if(sockets.length==0){
            return 'i have nothing to burn'
        }
        sockets.map(n=>{
            n.disconnect()
        })
        sockets = []
    },
    drunk(txt){
        if(txt.startsWith('b!')){
             return 'hahahaha nice joke lmao hahaha fuck you'.split('').map(n=>{
                if(Math.random()>0.5) return n.toUpperCase()
                return n
            }).join('')
        }
        return txt.toLowerCase().split('').map(n=>{
            if(Math.random()>0.5) return n.toUpperCase()
            return n
        }).join('')
    },
    clickbait(txt){
        return (["omg!",':O','what?','wtf?!'][Math.floor(Math.random()*4)]+' '+txt+' '+["(gone wrong)",'(gone sexual)','(not clickbait!)','(cops called)'][Math.floor(Math.random()*4)]+'\u{1F631}'.repeat(Math.ceil(Math.random()*5))).toUpperCase()
    } 
}
socket.on('talk',function(data){
    var text = data.text
    if(text.startsWith('b!')){
        text = text.slice(2)
        var cmd = text.split(' ')[0]
        var oth = text.slice(cmd.length+1)
        if(Object.keys(commands).includes(cmd)){
            var command = commands[cmd](oth)
            setTimeout(function(){
                socket.emit('talk',{text:command})
            },100)
        }
    }
})