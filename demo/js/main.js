$(document).ready(
    function () {
        if(decodeURI(GetQueryString("name"))!="管理员"){
            document.getElementById("menuc").style.display = "none";
        }
        if(decodeURI(GetQueryString("yhgw"))!="录入岗位"){
            document.getElementById("menua").style.display = "none";
        }
        
    	$("#menua").click(
                function () {
                    $("#fsysmenu").animate({
                        right: '-128px'
                    }, 200);
                    $(window.parent.document).find("#mainfrm").attr(
                        "src", "luru.html?name=" + GetQueryString("name"));
                    $("#menua").css({
                        "background-image": "url(img/msgs.png)",
                        "background-color": "#FFF",
                        "color": "#505050"
                    });
                    $("#menub").css({
                        "background-image": "url(img/set.png)",
                        "background-color": "",
                        "color": "#FFF"
                    });
                    $("#menuc").css({
                        "background-image": "url(img/api.png)",
                        "background-color": "",
                        "color": "#FFF"
                    });
                });

        $("#menub").click(
            function () {
                $("#fsysmenu").animate({
                    right: '-128px'
                }, 200);
                $(window.parent.document).find("#mainfrm").attr(
                    "src", "shaixuan.html?name=" + GetQueryString("name") + "&yhgw=" + GetQueryString("yhgw"));
                $("#menub").css({
                    "background-image": "url(img/sets.png)",
                    "background-color": "#FFF",
                    "color": "#505050"
                });
                $("#menua").css({
                    "background-image": "url(img/msg.png)",
                    "background-color": "",
                    "color": "#FFF"
                });
                $("#menuc").css({
                    "background-image": "url(img/api.png)",
                    "background-color": "",
                    "color": "#FFF"
                });
            });

        $("#menuc").click(
            function () {
                $(window.parent.document).find("#mainfrm").attr(
                    "src", "user.html");
                $("#menuc").css({
                    "background-image": "url(img/2 (3).ico)",
                    "background-color": "#006290",
                    "color": "#FFF"
                });
                $("#menua").css({
                    "background-image": "url(img/msg.png)",
                    "background-color": "",
                    "color": "#FFF"
                });
                $("#menub").css({
                    "background-image": "url(img/set.png)",
                    "background-color": "",
                    "color": "#FFF"
                });
                $("#menud").css({
                    "background-color": "#FFF",
                    "color": "#505050"
                });
                $("#menue").css({
                    "background-color": "#006290",
                    "color": "#FFF"
                });
                $("#menuf").css({
                    "background-color": "#006290",
                    "color": "#FFF"
                });
                $("#fsysmenu").animate({
                    right: '0px'
                }, 200);
            });

        $("#fmtop").click(function () {
            $("#fsysmenu").animate({
                right: '-128px'
            }, 200);
        });

        $("#menud").click(
            function () {
                $(window.parent.document).find("#mainfrm").attr(
                    "src", "user.html");
                $("#menud").css({
                    "background-color": "#FFF",
                    "color": "#505050"
                });
                $("#menue").css({
                    "background-color": "#006290",
                    "color": "#FFF"
                });
                $("#menuf").css({
                    "background-color": "#006290",
                    "color": "#FFF"
                });
                $("#menua").css({
                    "background-image": "url(img/msg.png)",
                    "background-color": "",
                    "color": "#FFF"
                });
                $("#menub").css({
                    "background-image": "url(img/set.png)",
                    "background-color": "",
                    "color": "#FFF"
                });
                $("#menuc").css({
                    "background-image": "url(img/apis.png)",
                    "background-color": "",
                    "color": "#FFF"
                });
                $("#fsysmenu").animate({
                    right: '0px'
                }, 200);
            });
        $("#menue").click(
            function () {
                $(window.parent.document).find("#mainfrm").attr(
                    "src", "apiset/sql.jsp");
                $("#menue").css({
                    "background-color": "#FFF",
                    "color": "#505050"
                });
                $("#menud").css({
                    "background-color": "#006290",
                    "color": "#FFF"
                });
                $("#menuf").css({
                    "background-color": "#006290",
                    "color": "#FFF"
                });
                $("#menua").css({
                    "background-image": "url(img/msg.png)",
                    "background-color": "",
                    "color": "#FFF"
                });
                $("#menub").css({
                    "background-image": "url(img/set.png)",
                    "background-color": "",
                    "color": "#FFF"
                });
                $("#menuc").css({
                    "background-image": "url(img/apis.png)",
                    "background-color": "",
                    "color": "#FFF"
                });
                $("#fsysmenu").animate({
                    right: '0px'
                }, 200);
            });
        $("#menuf").click(
            function () {
                $(window.parent.document).find("#mainfrm").attr(
                    "src", "apiset/data_set.jsp");
                $("#menuf").css({
                    "background-color": "#FFF",
                    "color": "#505050"
                });
                $("#menue").css({
                    "background-color": "#006290",
                    "color": "#FFF"
                });
                $("#menud").css({
                    "background-color": "#006290",
                    "color": "#FFF"
                });
                $("#menua").css({
                    "background-image": "url(img/msg.png)",
                    "background-color": "",
                    "color": "#FFF"
                });
                $("#menub").css({
                    "background-image": "url(img/set.png)",
                    "background-color": "",
                    "color": "#FFF"
                });
                $("#menuc").css({
                    "background-image": "url(img/apis.png)",
                    "background-color": "",
                    "color": "#FFF"
                });
                $("#fsysmenu").animate({
                    right: '0px'
                }, 200);
            });
            $("#menug").click(function(){
                window.location.href = "./index.html";
            });

            $("#menuh").click(function(){
                $(window.parent.document).find("#mainfrm").attr(
                    "src", "modifypass.html");
            });

    });

    function GetQueryString(name)
    {
         var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
         var r = window.location.search.substr(1).match(reg);
         if(r!=null)return  decodeURI(r[2]); return null;
    }