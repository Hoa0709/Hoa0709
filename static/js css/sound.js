// const firebaseConfig = {
//     apiKey: "AIzaSyAHZfS4Qv4_5MTDhg878mNrfRNiMk4U_RQ",
//     authDomain: "iotlmh.firebaseapp.com",
//     databaseURL: "https://iotlmh-default-rtdb.firebaseio.com",
//     projectId: "iotlmh",
//     storageBucket: "iotlmh.appspot.com",
//     messagingSenderId: "327921209562",
//     appId: "1:327921209562:web:1d16332a1ff37a3ce8d5e3",
//     measurementId: "G-8PFX6JV8GG"
// };
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// firebase.analytics();
//----------------------
window.addEventListener('DOMContentLoaded', function() {
    GetSound()
    StatusSound()
})

function GetSound() {
    var firebaseRequest = firebase.database().ref('sound');
    firebaseRequest.on('value',
        function(data) {
            document.getElementById('myRange').value = `${data.val().volume}`;
            document.getElementById("valueSound").innerHTML = `${data.val().volume}`;
            if (data.val().status == 'ON') {
                document.getElementById('toggleSound').checked = true;
            } else document.getElementById('toggleSound').checked = false;
        });
}

function StatusSound() {
    var firebaseRef = firebase.database().ref('sound')
    document.querySelector('#toggleSound').addEventListener('click', () => {
        if (document.getElementById('toggleSound').checked == true) {
            firebaseRef.update({
                "status": "ON"
            })
        } else {
            firebaseRef.update({
                "status": "OFF"
            })
        }
    })
    var slider = document.getElementById("myRange");
    var output = document.getElementById("valueSound");
    // Hiển thị giá trị thanh trượt mặc định
    output.innerHTML = slider.value;
    //Cập nhật giá trị thanh trượt hiện tại (mỗi khi bạn kéo tay cầm thanh trượt)
    slider.oninput = function() {
        // output.innerHTML = this.value;
        firebaseRef.update({
            "volume": this.value
        })

    }
}
//uploadfile
$(document).ready(function() {
    $("#submit_file").click(function() {
        var fd = new FormData();
        var files = $('#file')[0].files;
        // Check file selected or not
        if (files.length > 0) {
            fd.append('file', files[0]);
            $.ajax({
                url: '/upload',
                type: 'post',
                data: fd,
                contentType: false,
                processData: false,
                success: function(response) {
                    alert(response);
                },
                error: function(xhr, status, error) {
                    alert('error send server!!!');
                }
            });
        } else {
            alert("Please select a file.");
        }
    });
});



var datatemp;

function ValueGas() {
    // firebase.database().ref().on('value',
    //     function (snapshot) {
    //         snapshot.forEach(
    //             function (data) {
    //                 console.log(data.val().Gas)
    //                 value = data.val().Gas; 
    //             }
    //         )
    //     }
    // )
    firebase.database().ref().on('value',
        function(snapshot) {
            snapshot.forEach(
                function(data) {
                    var temp = data.val().Gas;
                    datatemp = temp;
                    console.log(datatemp)
                }
            );
        });
    console.log(datatemp)
}
//Load
// window.addEventListener('DOMContentLoaded', function () {
//     ValueGas()
// })