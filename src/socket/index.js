const SocketIO = require('socket.io');
const rooms = {};  // 채팅방 목록 관리

module.exports = (server) => {
    const io = SocketIO(server, { path: '/socket.io' });

    io.on('connection', (socket) => {
        console.log(`클라이언트 접속: ${socket.id}`);

        // 채팅방 입장 요청
        socket.on('joinRoom', (roomName) => {
            if (!rooms[roomName]) {
                socket.emit('roomError', '채팅방이 존재하지 않습니다.');
                return;
            }

            if (rooms[roomName].length >= 10) {
                socket.emit('roomFull', '이 채팅방은 이미 가득 찼습니다.');
                return;
            }

            // 채팅방에 입장
            rooms[roomName].push(socket.id);
            socket.join(roomName);
            socket.emit('joinedRoom', `채팅방 "${roomName}"에 입장했습니다.`);
            io.to(roomName).emit('newMessage', `${socket.id}님이 입장했습니다.`);
        });

        // 채팅방 목록 가져오기
        socket.on('getRooms', () => {
            socket.emit('roomList', Object.keys(rooms));  // 채팅방 목록 반환
        });

        // 새로운 채팅방 생성
        socket.on('createRoom', (roomName) => {
            debugger;
            if (rooms[roomName]) {
                socket.emit('roomError', '이미 존재하는 채팅방입니다.');
                return;
            }
            rooms[roomName] = [];
            socket.emit('roomCreated', `새로운 채팅방 "${roomName}"이 생성되었습니다.`);
            io.emit('roomList', Object.keys(rooms));  // 채팅방 목록 갱신
        });

        // 메시지 전송
        socket.on('sendMessage', (roomName, message) => {
            console.log('roomName', roomName, 'message', message)
            io.to(roomName).emit('newMessage', message, socket.id);
        });

        // 연결 종료 시 처리
        socket.on('disconnect', () => {
            for (const roomName in rooms) {
                const index = rooms[roomName].indexOf(socket.id);
                if (index !== -1) {
                    rooms[roomName].splice(index, 1);
                    io.to(roomName).emit('newMessage', `${socket.id}님이 나갔습니다.`);
                }
            }
            console.log(`클라이언트 접속 해제: ${socket.id}`);
        });

        socket.on('error', console.error);
    });
};
