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
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// firebase.analytics();
//----------------------------------
// js May Bom
function Submit_FormWithTime(floor){
    const firebaseRef = firebase.database().ref('may_bom/'+floor)
    firebaseRef.update({
        "time_on": document.querySelector('#timeOn-'+floor).value,
        "time_off": document.querySelector('#timeOff-'+floor).value
    })
}
function LoadAutoTimingMode(floor){ 
    const tableTimeMode = document.getElementById('tableTimeMode-'+floor);
    const autoMode = document.getElementById('toggleAutoMode-'+floor);
    const timeMode = document.getElementById('toggleTimeMode-'+floor);
    const noneMode = document.getElementById('toggleNoneMode-'+floor);
    const timeOn = document.querySelector('#timeOn-'+floor);
    const timeOff = document.querySelector('#timeOff-'+floor);
    const valueTimeOn = document.querySelector('#valueTimeOn-' + floor);
    const valueTimeOff = document.querySelector('#valueTimeOff-' + floor);
    const firebaseRef = firebase.database().ref('may_bom/'+floor);
    autoMode.addEventListener('click', () => {
        if(autoMode.checked == true){
            firebaseRef.update({
                "mode": "auto_mode",
                "status":"OFF"
            });
            timeMode.checked = false;

        }else{
            firebaseRef.update({
                "mode": "none_mode",
                "status":"OFF"
            });
            noneMode.checked = timeMode.checked = false;
        }
    })
    timeMode.addEventListener('click', () => {
        if(timeMode.checked == true){
            firebaseRef.update({
                "mode": "timer_mode",
                "status":"OFF"
            });
            autoMode.checked = false;
        }else{
            firebaseRef.update({
                "mode": "none_mode",
                "status":"OFF"
            });
            autoMode.checked = false;
        }
    })
    noneMode.addEventListener('click', () => {
        if(noneMode.checked == true){
            firebaseRef.update({
                "mode": "none_mode",
                "status":"ON"
            });
            autoMode.checked = timeMode.checked = false;
        }else{
            firebaseRef.update({
                "mode": "none_mode",
                "status":"OFF"
            });
            autoMode.checked = timeMode.checked = false;
        }
    })
    firebaseRef.on('value',
        function (data) {
            const time_on = data.val().time_on;
            const time_off = data.val().time_off;
            const mode = data.val().mode;
            const status = data.val().status;
            if(typeof (status) !== "undefined"){
                document.querySelector('#status-' + floor).innerHTML = '&nbsp;<i class="fas fa-circle-notch fa-spin"></i>&nbsp;Trạng thái: '+ `${status}`;
            }
            if(typeof (mode) !== "undefined"){
                if(mode == 'auto_mode'){
                    autoMode.checked = true;
                    timeMode.checked = false;
                }else if(mode == 'timer_mode'){
                    timeMode.checked = true;
                    autoMode.checked = false;
                }else if(mode == 'none_mode'){
                    timeMode.checked = false;
                    autoMode.checked = false;
                } 
                if(status == 'ON'){
                    noneMode.checked = true;
                }else noneMode.checked = false;
                document.querySelector('#mode-' + floor).innerHTML = '&nbsp;<i class="fas fa-cog fa-spin"></i>&nbsp;Chế độ: '+`${mode}`;
            }
            if (typeof (time_on) !== "undefined" && typeof (time_off) !== "undefined") {
                timeOn.value = time_on;
                timeOff.value = time_off;
                valueTimeOn.innerHTML = '&nbsp;<i class="fas fa-hourglass-start"></i>&nbsp;Giờ mở đã cài: '+`${time_on}`;
                valueTimeOff.innerHTML = '&nbsp;<i class="fas fa-hourglass-end"></i>&nbsp;Giờ tắt đã cài: '+`${time_off}`;
                if(mode == 'timer_mode'){
                    tableTimeMode.style.opacity = 1;
                    tableTimeMode.style.pointerEvents = 'auto';
                    valueTimeOn.style.opacity = 1;
                    valueTimeOff.style.opacity = 1;
                }else{
                    tableTimeMode.style.opacity = 0.3;
                    tableTimeMode.style.pointerEvents = 'none';
                    valueTimeOn.style.opacity = 0.3;
                    valueTimeOff.style.opacity = 0.3;
                }
            }
        });
    
}
window.addEventListener('DOMContentLoaded', function () {
    LoadAutoTimingMode('G')
})