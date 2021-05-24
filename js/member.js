


function login(){
  var username = document.getElementById("login-id");
  var password = document.getElementById("login-pw");

  if (username.classList.contains('is-invalid'))
    username.classList.remove('is-invalid');
  if (password.classList.contains('is-invalid'))
    password.classList.remove('is-invalid');

  if(!isInputEmpty(username) && !isInputEmpty(password)){
    const data = {
      id: username.value,
      password: password.value
    };

    CommLoginMember(data);

    $("#loginModal").modal('hide');
  }
}

function logout(){
}

// check empty required field
// if empty, return false
// else then, return true
// param: input element
function isInputEmpty(input){
  if (input.value == "" || input.value == undefined) {
    input.classList.add('is-invalid');
    return true;
  }
  return false;
}

function clearJoinInputValidation(){
  var inputs = document.querySelectorAll(".join-form .row .col-8 input");

  inputs.forEach(input => {
    if(input.classList.contains('is-invalid'))
      input.classList.remove('is-invalid');
  });
}

function clearJoinInput(){
  var inputs = document.querySelectorAll(".join-form .row .col-8 input");

  inputs.forEach(input => {
    input.value = "";
  });
}

function checkEmail(str) {
  var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

  if(!reg_email.test(str)){
    return false;
  }else{
    return true;
  }
}

async function join(){
  var id = document.getElementById("user-id");
  var pw = document.getElementById("user-pw");
  var pw2 = document.getElementById("user-pw-confirm");
  var name = document.getElementById("user-name");
  var company = document.getElementById("user-company");
  var depart = document.getElementById("user-department");
  var email = document.getElementById("user-email");
  var role = document.getElementById("user-role");

  var joinBtn = document.getElementById("join-btn");

  clearJoinInputValidation();

  // required field만 확인
  if(!isInputEmpty(id) && !isInputEmpty(pw) && !isInputEmpty(pw2) && !isInputEmpty(name) && !isInputEmpty(company) && !isInputEmpty(email)){
    const data = {
      id: id.value,
      password: pw.value,
      name: name.value,
      email: email.value,
      company: company.value,
      department: depart.value,
      role: role.value,
      grade: "User"
    };

    try {
      let res = await CommJoinMember(data);

    } catch(err) {
      console.error(err);
    }
    
    clearJoinInput();

    $("#joinModal").modal('hide');

    document.querySelector("#logoutModal .modal-dialog .modal-content .modal-body").innerHTML = "회원가입이 완료되었습니다.";
    $("#logoutModal").modal('show');

    document.querySelector("#logoutModal .modal-dialog .modal-content .modal-body").innerHTML = "로그아웃 하시겠습니까?";  
  }else{
    if (joinBtn.hasAttribute('data-bs-dismiss'))
      joinBtn.removeAttribute('data-bs-dismiss');

    // 만약 두 비밀번호가 동일하지 않다던지...
    if (pw.value != pw2.value) {
      pw2.nextElementSibling.innerHTML = "입력하신 비밀번호가 동일하지 않습니다.";

      // 만약 이메일 형식이 안 맞는다던지...
    } else if (!checkEmail(email.value)) {
      email.nextElementSibling.innerHTML = "입력하신 이메일 주소가 형식에 맞지 않습니다.";
    }
  }
}