const fs=require('fs')//node js 기본 내장모듈 불러오기
const express =require('express') //설치한 express 모듈 불러오기
const socket =require('socket.io') // 설치한 socket.io 모듈 불러오기
const http=require('http') // node.js 기본 내장 모듈 불러오기
const app=express() // express객체 생성
const server=http.createServer(app) //express http 서버 생성
const io= socket(server) //생성된 서버를 socket.io에 바인딩

app.use('/css',express.static('./static/css'))
app.use('/js', express.static('./static/js'))//위 2줄은 정적파일을 제공하기 위해 미들웨어를 사용하는 코드

app.get('/', function(request,response) //get 방식으로 /경로에 접속하면 실행됨
{
    fs.readFile('./static/index.html',function(err,data)//readFile() 함수는 지정된 파일을 읽어서 데이터를 가져옵니다!
    // 만약 에러가 발생하면 err에 에러 내용을 담아온다
    //response(응답) 객체를 통해 읽어온 데이터를 전달해주어야합니다!
    {
        if(err)
        {
            response.send('error!!')
        }
        else
        {
            response.writeHead(200, {'Content-Type': 'text/html'})//HTML 파일이라는 것을 알려야하기 때문에 헤더에 해당 내용을 작성해서 보내줍니다.(writeHead)
            response.write(data)//헤더를 작성했으면 이제 HTML 데이터를 보내줍니다.(write)
            response.end()//모두 보냈으면 완료됬음을 알립니다.(end)
            //write를 통해 응답할 경우 꼭 end를 사용해야 한다!!
        }
    })
    /*console.log('유저가 /으로 접속했습니다')
    response.end('hello, express server!!')
*/
})

io.sockets.on('connection',function(socket)//on()은 소켓에서 해당 이벤트를 받으면 콜백함수가 실행됩니다!
//connection 이라는 이벤트가 발생할 경우 콜백함수가 실행됩니다.
{
    console.log('유저 접속 됨')
    socket.on('newUser', function(name)//새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌
    {
        console.log(name+ ' 님이 접속하였습니다.')

        socket.name=name//소켓에 이름 저장해두기

        io.sockets.emit('update',{type:'connectm', name:'SERVER', message:name+'님이 접속했습니다'})//모든 소켓에게 전송
    })
    socket.on('message', function(data)//전송한 메시지받기
    {
        data.name=socket.name
        console.log(data)

        socket.broadcast.emit('update',data)// 보낸사람을 제외한 나머지에게  메시지 전송
    })

    socket.on('disconnect',function()//접속종료
    {
        console.log(socket.name+'님이 나갔습니다')

        socket.broadcast.emit('update',{type:'disconnect', name:'SERVER', message:socket.name+'님이 나갔습니다'})//나가는 사람을 제외한 유저에게 전송

    })

    
    socket.on('send',function(data)
    {
        console.log('전달된 메시지',data.msg)
    })

    socket.on('disconnect',function()
    {
        console.log('접속 종료')
    })
})

server.listen(8080,function() //서버를 8080 포트로 listen
{
    console.log('서버 실행중...')
})

