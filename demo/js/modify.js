(function Init() {
    //点击注册界面注册
    var saveuser = document.getElementById("saveuser");
    saveuser.addEventListener("click", Saveuser, false);
})();

function Saveuser() {
    var allinput = document.getElementsByClassName("input")[0].getElementsByTagName("input");
    var json = [];
    var row = {};
    row["ID"] = "-1";
    var password;
    for (var i = 0; i < allinput.length; i++) {
        if (allinput[i].value == "" || allinput[i].value == null) {
            alert("内容不能为空！");
            allinput[i].style.background = "red";
            allinput[i].addEventListener("mouseover", function (e) {
                e.currentTarget.style.background = "#FFF";
            }, false);
            return;
        }
        if (allinput[i].name == "password" || allinput[i].name == "centerpassword") {
            if (typeof (password) != "undefined") {
                if (password != allinput[i].value) {
                    alert("密码不一致！");
                    return;
                }
            }
            password = allinput[i].value;
        }
        row[allinput[i].name] = allinput[i].value;
    }
    json.push(row);
    PostDate(window.location.origin + "/WebService.asmx/HttpPostInsertUser", "Jsons=" + JSON.stringify(json), regsave);
}

function regsave(json) {
    var row = json[0];
    if (row.id == "0") {
        alert(row.mess);
    } else {
        alert(row.mess);
    }
}