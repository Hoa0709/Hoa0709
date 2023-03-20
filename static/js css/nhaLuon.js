


function Submit_FormWithTime(floor){
    const firebaseRef = firebase.database().ref('nhaLuon')
    firebaseRef.update({
        "time_on": document.querySelector('#timeOn-'+floor).value,
        "time_off": document.querySelector('#timeOff-'+floor).value
    })
}
function LoadAutoTimingModeNL(floor){ 
    const tableTimeMode = document.getElementById('tableTimeMode-'+floor);
    const timeMode = document.getElementById('toggleTimeMode-'+floor);
    const noneMode = document.getElementById('toggleNoneMode-'+floor);
    const timeOn = document.querySelector('#timeOn-'+floor);
    const timeOff = document.querySelector('#timeOff-'+floor);
    const valueTimeOn = document.querySelector('#valueTimeOn-' + floor);
    const valueTimeOff = document.querySelector('#valueTimeOff-' + floor);
    const firebaseRef = firebase.database().ref('nhaLuon');
    timeMode.addEventListener('click', () => {
        if(timeMode.checked == true){
            firebaseRef.update({
                "mode": "timer_mode",
                "lightStatus":"OFF"
            });
        }else{
            firebaseRef.update({
                "mode": "none_mode",
                "lightStatus":"OFF"
            });
        }
    })
    noneMode.addEventListener('click', () => {
        if(noneMode.checked == true){
            firebaseRef.update({
                "mode": "none_mode",
                "lightStatus":"ON"
            });
        }else{
            firebaseRef.update({
                "mode": "none_mode",
                "lightStatus":"OFF"
            });
        }
    })
    firebaseRef.on('value',
        function (data) {
            const time_on = data.val().time_on;
            const time_off = data.val().time_off;
            const mode = data.val().mode;
            const lightStatus = data.val().lightStatus;
            if(typeof (lightStatus) !== "undefined"){
                document.querySelector('#status-' + floor).innerHTML = '&nbsp;<i class="fas fa-circle-notch fa-spin"></i>&nbsp;Trạng thái: '+ `${lightStatus}`;
            }
            if(typeof (mode) !== "undefined"){
                if(mode == 'timer_mode'){
                    timeMode.checked = true;
                }else if(mode == 'none_mode'){
                    timeMode.checked = false;
                } 
                if(lightStatus == 'ON'){
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
    LoadAutoTimingModeNL('nhaLuon')
})

//// BIỂU ĐỒ ÁNH SÁNG NHÀ LƯỢN
function bieudoANHSANGNhaLuon() {
    var datalight;
    firebase.database().ref('nhaLuon').on('value',
        function (data) {
            var light = data.val().Light;
            if (typeof (light) !== "undefined") {
                datalight = light;
            }
        });

    function onRefresh(chart) {
        chart.data.datasets.forEach(function (dataset) {
            dataset.data.push({
                x: Date.now(),
                y: datalight

            });
        });
    }
    var ctx = document.getElementById('myChart3NhaLuon').getContext('2d');
    var chart = new Chart(ctx, {

        type: 'line',
        data: {
            datasets: [{
                label: "light [%]",
                labelString: "%",
                borderColor: 'rgb(255, 255, 0)',
                backgroundColor: 'rgba(255, 255, 204, 0.5)',
                fill: false,
                cubicInterpolationMode: 'monotone',
                data: []
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            hoverMode: 'nearest',
            scales: {
                x: {
                    type: 'realtime',
                    realtime: {
                        duration: 10000,
                        refresh: 2000,
                        delay: 2000,
                        onRefresh: onRefresh
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    title: {
                        display: true,
                        text: '[%]'
                    },
                    min: -3,
                    max: 103
                }
            },
            interaction: {
                intersect: false
            },
            plugins: {
                datalabels: {
                    backgroundColor: function (context) {
                        return context.dataset.backgroundColor;
                    },
                    padding: 4,
                    borderRadius: 4,
                    clip: true,
                    color: 'black',
                    font: {
                        weight: 'bold'
                    },
                    formatter: function (value) {
                        return value.y;
                    }
                }
            }
        }
    });
}
// Load
window.addEventListener('DOMContentLoaded', function () {
    bieudoANHSANGNhaLuon();
})

