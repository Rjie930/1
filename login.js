document.write("<script type='text/javascript' src='/js/Barrett.js'></script>");
document.write("<script type='text/javascript' src='/js/BigInt.js'></script>");
document.write("<script type='text/javascript' src='/js/RSA.js'></script>");

function changeCode() {
	var time = new Date().getTime();
	$("#image_code").attr("src", "/common/image_code.jsp?time=" + time);
}

function changeMCode() {
	var time = new Date().getTime();
	$("#m_code").attr("src", "/common/m_code.jsp?time=" + time);
}

function login() {
	var username = $("#username").val();

	if (username == "") {
		alert("请输入上网帐号，@后面去掉");
		$("#username").focus();
		return;
	}

	var password = $("#password").val();

	if (password == "") {
		alert("请输入密码");
		$("#password").focus();
		return;
	}
	
	var code = $("#code").val();

	if (code == "") {
		alert("请输入验证码");
		$("#code").focus();
		return;
	}
	//var remember = document.getElementById("keep").checked;

	setMaxDigits(200);
	var key = new RSAKeyPair("10001","","b2867727e19e1163cc084ea57b9fa8406a910c6703413fa7df96c1acdca7b983a262e005af35f9485d92cd4c622eca4a14d6fd818adca5cae73d9d228b4ef05d732b41fb85f80af578a150ebd9a2eb5ececb853372ca4731ca1c8686892987409be3247f9b26cae8e787d8c135fc0652ec0678a5eda0c3d95cc1741517c0c9c3");
	var loginKey = encryptedString(key, '{"userName":"' + username + '","password":"' + password + '","rand":"' + code + '"}');
	//console.log(loginKey)

	var wlanuserip = $("#wlanuserip").val()
	var wlanacip = $("#wlanacip").val()

	$.ajax({
		type : 'POST',
		url : '/ajax/login',
		cache : false,
		//data : "wlanuserip=" + $("#wlanuserip").val() + "&wlanacip=" + $("#wlanacip").val() + "&username=" + username + "&password=" + BASE64.encoder(password) + "&code=" + code,
		data: {
			loginKey: loginKey,
			wlanuserip: wlanuserip,
			wlanacip: wlanacip
		},
		//data: "loginKey=" + loginKey + "&wlanuserip=" + $("#wlanuserip").val() + "&wlanacip=" + $("#wlanacip").val(),
		dataType : 'json',
		success : function(data, textStatus) {
			if (data.resultCode == "0" || data.resultCode == "13002000" ) {
				$("#login").css('display','none'); 
				$("#success").css('display','block');
				/*
				if(remember) {
					setCookie('username',username,'password',password);
				} else {
					cleanCookie('username', 'password');
				}
				*/
				changeCode();
			} else {
				//cleanCookie('username', 'password');
				changeCode();
				if(data.resultCode == "13018000") {
					alert("已办理一人一号多终端业务的用户，请使用客户端登录");
				} else {
					alert(data.resultInfo);
				}
			}
		}
	});

}

function logout() {
	$.ajax({
		type : 'POST',
		url : '/ajax/logout',
		cache : false,
		data : "wlanuserip=" + $("#wlanuserip").val() + "&wlanacip=" + $("#wlanacip").val(),
		dataType : 'json',
		success : function(data, textStatus) {
			if (data.resultCode == "0") {
				alert("下线成功");
			} else {
				alert(data.resultInfo);
			}
			
			window.location.reload();
		}
	});
}

function gotoModifyPassword() {
	$("#login").css('display','none'); 
	$("#modifypassword").css('display','block');
}

function modifyPassword() {
	var username = $("#m_username").val();

	if (username == "") {
		alert("请输入上网帐号，@后面去掉");
		$("#m_username").focus();
		return;
	}

	var oldpassword = $("#m_oldpassword").val();

	if (oldpassword == "" || oldpassword.length < 6) {
		alert("请输入旧密码，长度最少6位");
		$("#m_oldpassword").focus();
		return;
	}
	
	var password = $("#m_password").val();

	if (password == "" || password.length < 6) {
		alert("请输入新密码，长度最少6位");
		$("#m_password").focus();
		return;
	}
	
	var cpassword = $("#c_password").val();

	if (password != cpassword) {
		alert("两次密码不一致");
		$("#c_password").focus();
		return;
	}
	
	var ccode = $("#c_code").val();
	if (ccode == "") {
		alert("请输入验证码");
		$("#c_code").focus();
		return;
	}
	
	countNum(30);
	
	$.ajax({
		type : 'POST',
		url : '/ajax/modifypassword',
		cache : false,
		data : "code=" + ccode + "&username=" + username + "&password=" + password + "&oldPassword=" + oldpassword + "&wlanuserip=" + $("#wlanuserip").val() + "&wlanacip=" + $("#wlanacip").val(),
		dataType : 'json',
		success : function(data, textStatus) {
			if (data.resultCode == "0") {
				alert("修改成功");
			} else {
				alert(data.resultInfo);
			}
		}
	});
}

function countNum(i) {
	var pwdButton = document.getElementById('passwdBtn');
	var backBtn = document.getElementById('backBtn');
	if(pwdButton != null) {
		if(i == 0) {
			pwdButton.innerHTML = "重新提交";	
			pwdButton.disabled=false;
			if(backBtn != null) {
				backBtn.disabled=false;
			}
			return;
		}
		pwdButton.innerHTML = i + "秒后再提交";
		pwdButton.disabled=true;
		if(backBtn != null) {
			backBtn.disabled=true;
		}
		window.setTimeout("countNum(" + (i - 1) + ")", 1000);
	}
}


function countNum1(i) {
	var authCodeButton = document.getElementById('authCodeButton');
	
	if(authCodeButton != null) {
		if(i == 0) {
			authCodeButton.innerHTML = "<a href=\"javascript:getAuthCode()\">获取短信验证码</a>";	
			return;
		}
		authCodeButton.innerHTML = i + "秒";
		
		window.setTimeout("countNum1(" + (i - 1) + ")", 1000);
	}
	
}

function getAuthCode() {
	var username = $("#r_username").val();

	if (username == "") {
		alert("请输入上网帐号，@后面去掉");
		$("#r_username").focus();
		return;
	}

	var code = $("#r_code").val();
	if (code == "") {
		alert("请输入验证码");
		$("#r_code").focus();
		return;
	}
	
	countNum1(60);
	
	$.ajax({
		type : 'POST',
		url : '/ajax/authCode',
		cache : false,
		data : "username=" + username + "&imgCode=" + code + "&wlanuserip=" + $("#wlanuserip").val() + "&wlanacip=" + $("#wlanacip").val(),
		dataType : 'json',
		success : function(data, textStatus) {
			if (data.resultCode == "0") {
				alert("获取验证码成功，请耐心等待");
				$("#r_phone").val(data.phone);
			} else {
				changeMCode();
				alert(data.resultInfo);
			}
			
		}
	});
}

function checkIsCanRest() {
	var username = $("#r_username").val();

	if (username == "") {
		alert("请输入上网帐号，@后面去掉");
		$("#r_username").focus();
		return;
	}
	
	
	var authCode = $("#r_authCode").val();
	if (authCode == "") {
		alert("请输入短信验证码");
		$("#r_authCode").focus();
		return;
	}
	

	$.ajax({
		type : 'POST',
		url : '/ajax/reset',
		cache : false,
		//data : "operate=check" + "&imgCode=" + code + "&authCode=" + authCode + "&username=" + username + "&wlanuserip=" + $("#wlanuserip").val() + "&wlanacip=" + $("#wlanacip").val(),
		data : "operate=check" +  "&authCode=" + authCode + "&username=" + username + "&wlanuserip=" + $("#wlanuserip").val() + "&wlanacip=" + $("#wlanacip").val(),
		dataType : 'json',
		success : function(data, textStatus) {
			if (data.resultCode == "0") {
				$("#step0").css('display','none'); 
				$("#step1").css('display','block');
			} else {
				alert(data.resultInfo);
			}
			
		}
	});
}

function resetPassword() {
	var username = $("#r_username").val();

	if (username == "") {
		alert("请输入上网帐号，@后面去掉");
		$("#r_username").focus();
		return;
	}
	
	
	var authCode = $("#r_authCode").val();

	if (authCode == "") {
		alert("请输入短信验证码");
		$("#r_authCode").focus();
		return;
	}
	
	var code = $("#r_code").val();
	if (code == "") {
		alert("请输入验证码");
		$("#r_code").focus();
		return;
	}
	
	var r_password = $("#r_password").val();
	if (r_password == "") {
		alert("输入您的新密码");
		$("#r_password").focus();
		return;
	} else if(r_password.length < 8) {
		alert("密码8到12位");
		$("#r_password").focus();
		return;
	}
	
	var r_password1 = $("#r_password1").val();
	if (r_password1 == "") {
		alert("再次输入您的新密码");
		$("#r_password1").focus();
		return;
	}
	
	if(r_password != r_password1) {
		alert("两次密码输入不一致");
		return;
	}
	
	$.ajax({
		type : 'POST',
		url : '/ajax/reset',
		cache : false,
		data : "operate=reset" + "&imgCode=" + code + "&authCode=" + authCode + "&username=" + username + "&password=" + r_password + "&wlanuserip=" + $("#wlanuserip").val() + "&wlanacip=" + $("#wlanacip").val(),
		dataType : 'json',
		success : function(data, textStatus) {
			if (data.resultCode == "0") {
				$("#step1").css('display','none'); 
				$("#step2").css('display','block');
			} else {
				alert(data.resultInfo);
			}
			
		}
	});
}

function initData() {
	document.getElementById('username').value = getCookie('username');
	document.getElementById('password').value = getCookie('password');
}

function getCookie(c_name)
{
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) { 
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf("^",c_start);
            if (c_end==-1)
                c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
    } 
  }
    return "";
}

function setCookie(c_name, n_value, p_name, p_value)
{
    var exdate = new Date();
    exdate.setMonth(exdate.getMonth() + 1);
    document.cookie = c_name + "=" + escape(n_value) + "^" + p_name + "=" + escape(p_value) + "^;expires=" + exdate.toGMTString();
}

function cleanCookie(c_name, p_name) {
    document.cookie = c_name + "=" + ";" + p_name + "=" + ";expires=Thu, 01-Jan-70 00:00:01 GMT";
}
