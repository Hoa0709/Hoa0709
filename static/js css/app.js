// Set up FIREBASE

var firebaseConfig = {
    apiKey: "AIzaSyDKYw5kcbob3siFE77zk6VAzx7Y9AC-Opg",
    authDomain: "iot-quyduong.firebaseapp.com",
    databaseURL: "https://iot-quyduong-default-rtdb.firebaseio.com",
    projectId: "iot-quyduong",
    storageBucket: "iot-quyduong.appspot.com",
    messagingSenderId: "960752218052",
    appId: "1:960752218052:web:915155b3092c116bf0fe91"
    // measurementId: "G-5E3V8QN22R"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

function Time(number) {
    var day = new Date(new Date().setDate(new Date().getDate() - number));
    var dd = String(day.getDate());
    var mm = String(day.getMonth() + 1);
    var yyyy = day.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
}
today = Time(0);
yesterday01 = Time(1);
yesterday02 = Time(2);


//----status web-----
window.onbeforeunload = function(e) {
    firebase.database().ref('deviceCheck').update({
        "webPage": 0
    });
};
firebase.database().ref('deviceCheck').update({
    "webPage": 1
});
//-----------------------------------------------------------------------------
function LoadTempHumiLight(floor) {
    function InsertTempHumiLight(floor, time, temp, humi, light) {
        //Ex: Time-tangTret,Humi-tangMot,...
        document.querySelector('#Time-' + floor).innerHTML = `${time}`;
        document.querySelector('#Humi-' + floor).innerHTML = `${humi}`;
        document.querySelector('#Temp-' + floor).innerHTML = `${temp}`;
        document.querySelector('#Light-' + floor).innerHTML = `${light}`;
    }

    var x = "G/";
    firebase.database().ref(x).on('value',
        function(data) {
            var humi = parseFloat(data.val().Humidity);
            var temp = parseFloat(data.val().Temperature);
            var time = data.val().Time;
            var light = parseFloat(data.val().Light);
            InsertTempHumiLight(floor, time, temp, humi, light);
        });
}

window.addEventListener('load', function() {
    LoadTempHumiLight('G')

});
///////////////////////////////////////////////////////////////////

// Data ngày hôm nay G
// Show all data G
function showAllThongTinG() {
    if (document.getElementById('hiddenAllDataG').style.display === "none") {
        document.getElementById('hiddenAllDataG').style.display = "block";
        //document.getElementById('hiddenAllDataG').style.marginTop = "14px";
    } else {
        document.getElementById('hiddenAllDataG').style.display = "none";
    }
}
// Load
window.addEventListener('DOMContentLoaded', function() {
        showAllThongTinG()
    })
//////////////////////////////////////////////////////////////////////


// Show Phòng khach
function showG() {
    if (document.getElementById('hiddenG').style.display === "none") {
        document.getElementById('hiddenG').style.display = "block";
        document.getElementById('hiddenNKT').style.display = "none";
        document.getElementById('hiddenTableVoice').style.display = "none";
        document.getElementById('hiddenNhaLuon').style.display = "none";
        document.getElementById('hiddenAllDataNKT').style.display = "none";
        document.getElementById('hiddenAllDataNhaLuon').style.display = "none";
        document.getElementById('imageStayAtHome').style.display = "none";
        document.getElementById('G').setAttribute("class", "border-blue-700 border-4 rounded-lg");
        document.getElementById('NKT').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
        document.getElementById('NhaLuon').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
        document.getElementById('tablevoice').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
    } else {
        document.getElementById('hiddenG').style.display = "none";;
        document.getElementById('imageStayAtHome').style.display = "block";
        document.getElementById('G').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
    }
}
// Load
window.addEventListener('DOMContentLoaded', function() {
    showG()
})

// Show nha ky thuat
function showNKT() {
    if (document.getElementById('hiddenNKT').style.display === "none") {
        document.getElementById('hiddenNKT').style.display = "block";
        document.getElementById('hiddenG').style.display = "none";
        document.getElementById('hiddenNhaLuon').style.display = "none";
        document.getElementById('hiddenTableVoice').style.display = "none";
        document.getElementById('imageStayAtHome').style.display = "none";
        document.getElementById('hiddenAllDataG').style.display = "none";
        document.getElementById('hiddenAllDataNhaLuon').style.display = "none";
        document.getElementById('hiddenAllDataNKT').style.display = "block";
        document.getElementById('NKT').setAttribute("class", "border-green-700 border-4 rounded-lg");
        document.getElementById('G').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
        document.getElementById('NhaLuon').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
        document.getElementById('tablevoice').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
    } else {
        document.getElementById('hiddenNKT').style.display = "none";;
        document.getElementById('imageStayAtHome').style.display = "block";
        document.getElementById('NKT').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
        document.getElementById('hiddenAllDataNKT').style.display = "none";
    }
}
// Load
window.addEventListener('DOMContentLoaded', function() {
        showNKT();
    })
    //////////////////////////////////////////////////////////////

// DANH SÁCH BIỂU ĐỒ G
function bieudoNHIETDO() {
    var datatemp;
    firebase.database().ref('G').on('value',
        function(data) {
            var temp = data.val().Temperature;
            if (typeof(temp) !== "undefined") {
                datatemp = temp;
            }
        });

    function onRefresh(chart) {
        chart.data.datasets.forEach(function(dataset) {
            dataset.data.push({
                x: Date.now(),
                y: datatemp

            });
        });
    }
    var ctx = document.getElementById('myChart1').getContext('2d');
    var chart = new Chart(ctx, {

        type: 'line',
        data: {
            datasets: [{
                label: "temperature [°C]",
                labelString: "°C",
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 179, 179, 0.5)',
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
                        text: '[°C]'
                    },
                    min: 22,
                    max: 40
                }
            },
            interaction: {
                intersect: false
            },
            plugins: {
                datalabels: {
                    backgroundColor: function(context) {
                        return context.dataset.backgroundColor;
                    },
                    padding: 4,
                    borderRadius: 4,
                    clip: true,
                    color: 'black',
                    font: {
                        weight: 'bold'
                    },
                    formatter: function(value) {
                        return value.y;
                    }
                }
            }
        }
    });
}
// Load
window.addEventListener('DOMContentLoaded', function() {
    bieudoNHIETDO();
})

function bieudoDOAM() {
    var datahumi;
    firebase.database().ref('G').on('value',
        function(data) {
            var humi = data.val().Humidity;
            if (typeof(humi) !== "undefined") {
                datahumi = humi;
            }
        });

    function onRefresh(chart) {
        chart.data.datasets.forEach(function(dataset) {
            dataset.data.push({
                x: Date.now(),
                y: datahumi

            });
        });
    }
    var ctx = document.getElementById('myChart2').getContext('2d');
    var chart = new Chart(ctx, {

        type: 'line',
        data: {
            datasets: [{
                label: "humidity [%RH]",
                labelString: "%RH",
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
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
                        text: '[%RH]'
                    },
                    min: 40,
                    max: 100
                }
            },
            interaction: {
                intersect: false
            },
            plugins: {
                datalabels: {
                    backgroundColor: function(context) {
                        return context.dataset.backgroundColor;
                    },
                    padding: 4,
                    borderRadius: 4,
                    clip: true,
                    color: 'black',
                    font: {
                        weight: 'bold'
                    },
                    formatter: function(value) {
                        return value.y;
                    }
                }
            }
        }
    });
}
// Load
window.addEventListener('DOMContentLoaded', function() {
    bieudoDOAM();
})


function bieudoANHSANG() {
    var datalight;
    firebase.database().ref('G').on('value',
        function(data) {
            var light = data.val().Light;
            if (typeof(light) !== "undefined") {
                datalight = light;
            }
        });

    function onRefresh(chart) {
        chart.data.datasets.forEach(function(dataset) {
            dataset.data.push({
                x: Date.now(),
                y: datalight

            });
        });
    }
    var ctx = document.getElementById('myChart3').getContext('2d');
    var chart = new Chart(ctx, {

        type: 'line',
        data: {
            datasets: [{
                label: "light [%]",
                labelString: "%",
                borderColor: 'rgb(255, 205, 86)',
                backgroundColor: 'rgba(255, 255, 153, 0.5)',
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
                    max: 103,
                    min: 0
                }
            },
            interaction: {
                intersect: false
            },
            plugins: {
                datalabels: {
                    backgroundColor: function(context) {
                        return context.dataset.backgroundColor;
                    },
                    padding: 4,
                    borderRadius: 4,
                    clip: true,
                    color: 'black',
                    font: {
                        weight: 'bold'
                    },
                    formatter: function(value) {
                        return value.y;
                    }
                }
            }
        }
    });
}
// Load
window.addEventListener('DOMContentLoaded', function() {
    bieudoANHSANG();
})

/////////////////////////////////////////////////////////////////

//BUTTON BIỂU ĐỒ CHARTJS G
function bieudo1() {
    document.getElementById('myChart1').style.display = "block";
    document.getElementById('myChart2').style.display = "none";
    document.getElementById('myChart3').style.display = "none";
}
window.addEventListener('DOMContentLoaded', function() {
    bieudo1();
})

function bieudo2() {
    document.getElementById('myChart2').style.display = "block";
    document.getElementById('myChart1').style.display = "none";
    document.getElementById('myChart3').style.display = "none";
}
window.addEventListener('DOMContentLoaded', function() {
    bieudo2();
})

function bieudo3() {
    document.getElementById('myChart3').style.display = "block";
    document.getElementById('myChart1').style.display = "none";
    document.getElementById('myChart2').style.display = "none";
}
window.addEventListener('DOMContentLoaded', function() {
    bieudo3();
})


///////////////////////////////////////////////////////////////////

// Down thống kê Excel
function exportTableToExcel(tableID, filename = '') {
    var downloadLink;

    function exportTableToExcel(tableID, filename = '') {
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

        filename = filename ? filename + '.xls' : 'excel_data.xls';
        downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            var blob = new Blob(['\ufeff', tableHTML], {
                type: dataType
            });
            // thông báo tải xuống cho người dùng
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

            // Setting tên file
            downloadLink.download = filename;

            // bấm để download
            downloadLink.click();
        }
    }
}
// Show nha luon
function showNhaLuon() {
    if (document.getElementById('hiddenNhaLuon').style.display === "none") {
        document.getElementById('hiddenNhaLuon').style.display = "block";
        document.getElementById('hiddenNKT').style.display = "none";
        document.getElementById('hiddenG').style.display = "none";
        document.getElementById('hiddenTableVoice').style.display = "none";
        document.getElementById('imageStayAtHome').style.display = "none";
        document.getElementById('hiddenAllDataG').style.display = "none";
        document.getElementById('hiddenAllDataNKT').style.display = "none";
        document.getElementById('NKT').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
        document.getElementById('G').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
        document.getElementById('NhaLuon').setAttribute("class", "border-yellow-300 border-4 rounded-lg");
        document.getElementById('tablevoice').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
        document.getElementById('hiddenAllDataNhaLuon').style.display = "block";
    } else {
        document.getElementById('hiddenNhaLuon').style.display = "none";;
        document.getElementById('imageStayAtHome').style.display = "block";
        document.getElementById('NhaLuon').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
        document.getElementById('hiddenAllDataNhaLuon').style.display = "none";
    }
}
// Load
window.addEventListener('DOMContentLoaded', function() {
    showNhaLuon();
})

// Show Table Voice
function showTableVoice() {
    if (document.getElementById('hiddenTableVoice').style.display === "none") {
        document.getElementById('hiddenTableVoice').style.display = "block";
        document.getElementById('hiddenNKT').style.display = "none";
        document.getElementById('hiddenG').style.display = "none";
        document.getElementById('hiddenNhaLuon').style.display = "none";
        document.getElementById('imageStayAtHome').style.display = "none";
        document.getElementById('hiddenAllDataG').style.display = "none";
        document.getElementById('hiddenAllDataNhaLuon').style.display = "none";
        document.getElementById('hiddenAllDataNKT').style.display = "none";
        document.getElementById('NKT').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
        document.getElementById('G').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
        document.getElementById('NhaLuon').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
        document.getElementById('tablevoice').setAttribute("class", "border-green-200 border-4 rounded-lg");
    } else {
        document.getElementById('hiddenTableVoice').style.display = "none";;
        document.getElementById('imageStayAtHome').style.display = "block";
        document.getElementById('tablevoice').setAttribute("class", "border-4 border-gray-400 p-2 rounded-lg");
    }
}
// Load
window.addEventListener('DOMContentLoaded', function () {
    showTableVoice();
})

function LoadTableViewMore(floor, day) {
    function InsertTableViewMore(floor, day, time, temp, humi, light) {
        var tbody = document.getElementById('tbodythongke' + floor + day);
        var trow = document.createElement('tr');
        trow.setAttribute("class", "flex w-full md:mb-4");
        var td1 = document.createElement('td');
        td1.setAttribute("class", "p-2 w-full md:w-1/4")
        var td2 = document.createElement('td');
        td2.setAttribute("class", "p-2 w-full md:w-1/4")
        var td3 = document.createElement('td');
        td3.setAttribute("class", "p-2 w-full md:w-1/4")
        var td4 = document.createElement('td');
        td4.setAttribute("class", "p-2 w-full md:w-1/4")
        td1.innerHTML = time;
        td2.innerHTML = temp;
        td3.innerHTML = humi;
        td4.innerHTML = light;
        trow.appendChild(td1);
        trow.appendChild(td2);
        trow.appendChild(td3);
        trow.appendChild(td4);
        tbody.appendChild(trow);
    }
    var firebaseView = 'listData/G/';
    if (day == 'Today') {
        firebaseView += today
    } else if (day == 'Yesterday01') {
        firebaseView += yesterday01
    } else if (day == 'Yesterday02') {
        firebaseView += yesterday02
    } else {
        console.log('error')
    }
    firebase.database().ref(firebaseView).limitToLast(100).once('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    var humi = data.val().Humidity;
                    var temp = data.val().Temperature;
                    var time = data.val().Time;
                    var light = data.val().Light;
                    if (typeof (humi) !== "undefined" && typeof (temp) !== "undefined" && typeof (time) !== "undefined" && typeof (light) !== "undefined") {
                        InsertTableViewMore(floor, day, time, temp, humi, light);
                    }
                }
            )
        })
}
$(document).ready(function () {
    LoadTableViewMore('G', 'Today')
    LoadTableViewMore('G', 'Yesterday01')
    LoadTableViewMore('G', 'Yesterday02')
});