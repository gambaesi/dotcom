const SocketIO = require('socket.io');

module.exports = (server) => {
    const io = SocketIO(server, { path: '/socket.io' });

    io.on('connection', (socket) => {
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log('새로운 클라이언트 접속', ip, socket.id, req.ip);
        socket.on('disconnect', () => {
            console.log('클라이언트 접속 해제', ip, socket.id);
            clearInterval(socket.interval);
        })
        socket.on('reply', (data) => {
            console.log(data);
        })
        socket.on('error', console.error);
        socket.interval = setInterval(() => {
            socket.emit('news', 'Hello Socket.IO'); // (이벤트 이름, 데이터)
        }, 3000)
    })
}