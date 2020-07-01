let socket = io();

socket.emit('updateSocketId', document.cookie);
socket.emit('checkUserStatus', {cookie:document.cookie, page:'userPanel'});



socket.on('ifAllowed', function (data) {
    //console.log(data);
    if(data.in === true){
        // const logout = document.getElementById('logout');
        // logout.addEventListener('click', function () {
        //     socket.emit('logout', {cookie:document.cookie, page:'userPanel'});
        //     //console.log(document.cookie);
        //     window.location = '/index.html';
        //     document.cookie = "username=; sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        //     window.alert('Logged Out');
        // });
    }else{
        window.location = '/index.html';
        //window.alert('Not allowed on that page');
    }
});

