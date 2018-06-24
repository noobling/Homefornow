// new Chart(document.getElementById("myChart1"),{
//     "type":"line",
//     "data":{
//         "labels":["January","February","March","April","May","June","July"],
//         "datasets":[{
//             "label":"My First Dataset",
//             "data":[65,59,80,81,56,55,40],
//             "fill":false,
//             "borderColor":"rgb(75, 192, 192)",
//             "lineTension":0.1
//         },
//         {
//             "label":"My Other Dataset",
//             "data":[58,33,72,82,40,48,62],
//             "fill":false,
//             "borderColor":"rgb(200, 30, 100)",
//             "lineTension":0.1
//         }]
//     },
//     "options":{}
// });
//
// $(document).ready(
//   $.ajax({
//     url: '/admin/data',
//     type: 'GET',
//     success: function(data) {
//       new Chart(document.getElementById("assistedChart"),
//       {
//           "type":"line",
//           "data":{
//               "labels":["January","February","March","April","May","June","July"],
//               "datasets":[{
//                   "label":"Assisted Persons",
//                   "data":data.assistData,
//                   "fill":false,
//                   "borderColor":"rgb(204, 0, 102)",
//                   "lineTension":0.1
//               },
//               {
//                   "label":"Unassisted Persons",
//                   "data":data.unassistData,
//                   "fill":false,
//                   "borderColor":"rgb(51, 51, 51)",
//                   "lineTension":0.1
//               }]
//           },
//           "options":{}
//       });
//     },
//   })
// );

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}
