const URL = 'http://localhost:8081';
let user;

jQuery(document).ready(function () {


    $("#login-btn").click(function () {
        $("#login-form").toggle(function () {
            $("#login-form").css("visibility", "visible");
        });

    });

    $("#loginsub").click(function () {
        let username = $("#username").val();
        let password = $("#password").val();


        fetch(`${URL}/login`, {
            method: 'POST',
            body: {"username": username, "password": password}
        }).then((result) =>
            localStorage.setItem('token', result.headers.get('Authorization'))
        );

    });

    $("#signupsub").click(function () {
        let username = $("#username").val();
        let password = $("#password").val();


        fetch(`${URL}/users/sign-up`, {
            method: 'POST',
            body: {"username": username, "password": password}
        }).then((result) =>
            result.json().then((ruser) => {
                user = ruser;
            })
        );
    });
});