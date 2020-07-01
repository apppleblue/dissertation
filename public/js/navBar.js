
let html =
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">\
        <a class="navbar-brand" href="index.html">Registration</a>\
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">\
            <span class="navbar-toggler-icon">\</span>\
        </button>\
        <div class="collapse navbar-collapse" id="navbarSupportedContent">\
            <ul class="navbar-nav mr-auto">\
                <li class="nav-item active">\
                    <a class="nav-link" href="index.html">\Home <span class="sr-only">\(current)</span>\</a>\
                </li>\
            </ul>\
        </div>\
    </nav>';


let url = window.location.href;
let page = url.split("/").pop();
let name = page.split(".");
console.log(name[0]);
socket.emit('checkUserStatus', {cookie:document.cookie, page:name[0]});

socket.on('ifAllowed', function (data) {
    console.log(data);
    if(data.in === true){
        if(data.userLvl === 1){
             html =
                '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">\
                    <a class="navbar-brand" href="index.html">Registration</a>\
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">\
                        <span class="navbar-toggler-icon">\</span>\
                    </button>\
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">\
                        <ul class="navbar-nav mr-auto">\
                            <li class="nav-item active">\
                                <a class="nav-link" href="index.html">\Home <span class="sr-only">\(current)</span>\</a>\
                            </li>\
                            <li class="nav-item">\
                                <a class="nav-link" href="addNew.html">\Add User</a>\
                            </li>\
                        </ul>\
                        <button id="logout" class="btn btn-success">Logout</button>\
                    </div>\
                </nav>';
        }else if(data.userLvl === 2){
            html =
                '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">\
                    <a class="navbar-brand" href="index.html">Registration</a>\
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">\
                        <span class="navbar-toggler-icon">\</span>\
                    </button>\
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">\
                        <ul class="navbar-nav mr-auto">\
                            <li class="nav-item active">\
                                <a class="nav-link" href="index.html">\Home <span class="sr-only">\(current)</span>\</a>\
                            </li>\
                        </ul>\
                        <button id="logout" class="btn btn-success">Logout</button>\
                    </div>\
                </nav>';
        }else if(data.userLvl === 3){
            html =
                '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">\
                    <a class="navbar-brand" href="index.html">Registration</a>\
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">\
                        <span class="navbar-toggler-icon">\</span>\
                    </button>\
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">\
                        <ul class="navbar-nav mr-auto">\
                            <li class="nav-item active">\
                                <a class="nav-link" href="index.html">\Home <span class="sr-only">\(current)</span>\</a>\
                            </li>\
                        </ul>\
                        <button id="logout" class="btn btn-success">Logout</button>\
                    </div>\
                </nav>';
        }
    }else{
        html =
            '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">\
                <a class="navbar-brand" href="index.html">Registration</a>\
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">\
                    <span class="navbar-toggler-icon">\</span>\
                </button>\
                <div class="collapse navbar-collapse" id="navbarSupportedContent">\
                    <ul class="navbar-nav mr-auto">\
                        <li class="nav-item active">\
                            <a class="nav-link" href="index.html">\Home <span class="sr-only">\(current)</span>\</a>\
                        </li>\
                    </ul>\
                </div>\
            </nav>';
    }
    document.getElementById('nav').innerHTML = html;
});


document.getElementById('nav').innerHTML = html;
