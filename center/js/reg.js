$(function() {
      showLoader();
      $("#show_1").show();
      $("#show_2").hide();
      hideLoader();

});

function onAgree() {
      showLoader();
      $("#show_1").hide();
      $("#show_2").show();
      hideLoader();
}

function ajaxRequest(data, callback, errorcallback) {
    $.ajax({url : "https://api.dkdk.io/v2/dkdk",
           dataType : "json",
           crossDomain: true,
           cache : false,
           data : JSON.stringify(data),
           type : "POST",
           contentType: "application/json; charset=utf-8",
           async: false,
           success : function(r) {
             console.log(JSON.stringify(r));
             callback(r);
           },
           error:function(request,status,error){
               console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
               errorcallback(request,status,error);
           }
    });
}

function requestRegister() {
    showLoader();

    grecaptcha.ready(function() {
      grecaptcha.execute('6Lcpj4kUAAAAAPlT2X6WdKo7XcbmHQt8WiY3rAX4', {action: 'action_name'})
      .then(function(token) {
              var dkdk_name = $('#dkdk_name').val();
              var dkdk_email = $('#dkdk_email').val();
              var emailid = getCookie("temp_user_id");
              var dkdk_phonenumber = $('#dkdk_phonenumber').val();

              var data = {
                  "action": "developer",
                  "daction" : "register",
                  "name": dkdk_name,
                  "socialid" : dkdk_email,
                  "phone_number" : dkdk_phonenumber,
                  "captcha_token": token,
                  "emailid" : emailid
              };

              ajaxRequest(data, function(r) {
                      hideLoader();
                      if(r.result == "success") {
			  alert("축하드립니다, 성공적으로 가입되었습니다!");
                          window.location.href = "./index.html";
                      }
                      else {
                          alert("잘못된 정보입니다.");
                          $("#show_2").show();
                      }
                  },
                  function(request,status,error){

                     alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                     //
                     hideLoader();
                  });
      });
    });
}


function setCookie(cName, cValue, cDay){
    var expire = new Date();
    expire.setDate(expire.getDate() + cDay);
    cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
    if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
    document.cookie = cookies;
}


function getCookie(cName) {
    cName = cName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cName);
    var cValue = '';
    if(start != -1){
        start += cName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cValue = cookieData.substring(start, end);
    }
    return unescape(cValue);
}


function showLoader() {
  $("#loading").show();
}

function hideLoader() {
  $("#loading").fadeOut(800);
}
