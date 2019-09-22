var socket=io()

//접속되었을떄 실햄
socket.on('conect',function()
{
    var name = prompt('반갑습니다!','')//이름을 입력받는다

    if(!name)//이름이 빈칸인 경우
    {
        name='anonymous'
    }

    socket.emit('newUser',name)//서버에 새 유저가 왔다고 알림
    /*
    var input =document.getElementById('test')
    input.value='접속 됨'// 서버와 소켓이 연결되었을 때 id가 test인 요소의 값을 '접속 됨' 으로 설정*/
})

socket.on('update', function(data)
{
    console.log(`${data.name}: ${data.message}`)
})



//메시지 전송 함수
function send()//id가 test인 요소의 값을 서버로 전송
{
    //입력되어있는 데이터 가져오기
    var message=document.getElementById('test').value
    //가져온 후 데이터 빈칸으로 변경
    document.getElementById('test').value=''
    //서버로 send이벤트 전달+데이터와 함께
    socket.emit('message',{type:'message', message:message})//on은 수신, emit은 전송
}
