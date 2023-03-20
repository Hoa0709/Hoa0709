// js Nha Ky Thuat
function ControlNKT() {
    var firebaseRef = firebase.database().ref('nhaKyThuat')
    document.querySelector('#toggleLightNKT').addEventListener('click', () => {
        if (document.getElementById('toggleLightNKT').checked == true) {
            firebaseRef.update({
                "lightStatus": "ON"
            })
        } else {
            firebaseRef.update({
                "lightStatus": "OFF"
            })
        }
    })
}

function LoadNKT() {
    var firebaseRef = firebase.database().ref('nhaKyThuat')
    firebaseRef.on('value', function (data) {
        var lightStatus = data.val().lightStatus;
        var warningSound = data.val().warningSound;
        if (typeof (lightStatus) !== "undefined" && typeof (warningSound) !== "undefined") {
            if (lightStatus == "on" || lightStatus == "ON" || lightStatus == "On" || lightStatus == "oN") {
                document.getElementById('toggleLightNKT').checked = true;
            } else {
                document.getElementById('toggleLightNKT').checked = false;
            }
        }
    });
}
function Announce() {
    var firebaseRef = firebase.database().ref('nhaKyThuat')
    firebaseRef.on('value', function (data) {
        //var gas = data.val().Gas;
        var fire = data.val().Fire;
        if (parseInt(fire) == 0) {
            var promise = document.querySelector('#audiocanhbaochay').play();
            if (promise !== undefined) {
                promise.then(_ => {
                }).catch(error => {
                });
            }
            document.getElementById('toggleAmThanhNhaKyThuat').checked = true;
            document.getElementById('policealarm').style.display = "block";
            document.getElementById('policealarmoff').style.display = "none";
            document.getElementById('announce').innerHTML = 'Cảnh báo cháy !!!';
            if (document.getElementById('toggleAmThanhNhaKyThuat').checked == true) {
                document.getElementById("toggleAmThanhNhaKyThuat").click();
            }
        } else {
            document.getElementById('announce').innerHTML = 'Không có cảnh báo!';
            document.getElementById('policealarm').style.display = "none";
            document.getElementById('policealarmoff').style.display = "block";
            document.getElementById("audiocanhbaochay").pause();
            document.getElementById('toggleAmThanhNhaKyThuat').checked = false;
        }
    });
}
//Load
function LoadDevice() {
    var firebaseRefDevice = firebase.database().ref('deviceCheck')
    firebaseRefDevice.on('value', function (data) {
        var statusDevice1 = data.val().statusDevice1;
        var statusDevice2 = data.val().statusDevice2;
        var statusDevice3 = data.val().statusDevice3;
        if (typeof (statusDevice1) !== "undefined" && typeof (statusDevice2) !== "undefined" && typeof (statusDevice3) !== "undefined") {
            if (statusDevice1 == "GOOD") {
                document.getElementById('devide1').style.display = "block";
                document.getElementById('devide111').style.display = "none";
            } else {
                document.getElementById('devide1').style.display = "none";
                document.getElementById('devide111').style.display = "block";
            }
            if (statusDevice2 == "GOOD") {
                document.getElementById('devide2').style.display = "block";
                document.getElementById('devide211').style.display = "none";
            } else {
                document.getElementById('devide2').style.display = "none";
                document.getElementById('devide211').style.display = "block";
            }
            if (statusDevice3 == "GOOD") {
                document.getElementById('devide3').style.display = "block";
                document.getElementById('devide311').style.display = "none";
            } else {
                document.getElementById('devide3').style.display = "none";
                document.getElementById('devide311').style.display = "block";
            }
        }
    });
}

window.addEventListener('DOMContentLoaded', function () {
    Announce();
    ControlNKT();
    LoadNKT();
    LoadDevice();
})