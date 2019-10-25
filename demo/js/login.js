//点击登录
var submit = document.getElementById("Submit");
submit.addEventListener("click", function () {
    var name = document.getElementsByName("username")[0];
    var password = document.getElementsByName("password")[0];

    var json = [];
    var row = {};

    row["username"] = name.value;
    row["password"] = password.value;
    json.push(row);
    PostDate(window.location.origin + "/WebService.asmx/HttpPostSelectUsers", json, funlogin);
}, false);


//点击登录界面注册
// var register = document.getElementById("register");
// register.addEventListener("click", function () {
//     var div = document.getElementsByClassName("reg")[0];
//     div.style.display = "block";
//     var close = document.getElementsByClassName("close")[0];
//     close.addEventListener("click", function () {
//         var div = document.getElementsByClassName("reg")[0];
//         div.style.display = "none";
//     }, false);

//     //点击注册界面注册
//     var saveuser = document.getElementById("saveuser");
//     saveuser.addEventListener("click",Saveuser , false);
// }, false);


// function Saveuser() {
//     var name = document.getElementsByName("reguser")[0];
//     var password = document.getElementsByName("regpasswd")[0];
//     var regname = document.getElementsByName("regname")[0];
//     var json = [];
//     var row = {};
//     row["username"] = name.value;
//     row["password"] = password.value;
//     row["name"] = regname.value;
//     json.push(row);
//     PostDate(window.location.origin + "/WebService.asmx/HttpPostInsertUser", json, regsave);
// }


//发送数据到webservice
function PostDate(url, json, fun) {
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHttp');
    }
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("Jsons=" + JSON.stringify(json));

    xhr.onreadystatechange = function () { //请求后的回调接口，可将请求成功后要执行的程序写在其中
        if (xhr.readyState == 4 && xhr.status == 200) { //验证请求是否发送成功
            var xmlDoc = null; //获取到服务端返回的数据

            if (window.XMLHttpRequest) {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(xhr.responseText, "text/xml");
            } else {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = "false";
                xmlDoc.loadXML(xhr.responseText);
            }
            if (xmlDoc.childNodes[0].textContent != "" && xmlDoc.childNodes[0].textContent != null) {
                fun(JSON.parse(xmlDoc.childNodes[0].textContent));
            } else {
                alert("未知错误！");
            }
        }
    };
}

// function regsave(result) {
//     var row = JSON.parse(result)[0];
//     if (row.id == "0") {
//         alert(row.mess);
//         var close = document.getElementsByClassName("close")[0];
//         close.click();
//     } else {
//         alert(row.mess);
//     }
// }

function funlogin(json) {
    var row = json[0];
    if (row.id == "0") {
        window.location.href = "./main.html?name=" + encodeURI(encodeURI(row.mess));
    } else {
        alert(row.mess);
    }
}