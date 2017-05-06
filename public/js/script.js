// To keep track of answers made in new poll
var iteration = 3;

// Generate a color for each item in the dataset
var dynamicColors = function() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
}

$(document).ready(function() {
  var labels = [];
  var dataset = [];
  var colors = [];

  for (var i in data.answers) {
    labels.push(data.answers[i].answer);
    dataset.push(data.answers[i].votes);
    colors.push(dynamicColors());
  }

  console.log(colors);

  var ctx = document.getElementById("chart");
  var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels: labels,
          datasets: [{
              label: 'Number of Votes',
              data: dataset,
              backgroundColor: colors,
              hoverBackgroundColor: colors
          }]
      },
      options: {
        maintainAspectRatio: true
      }
  });
});

// Make a new input field per click
$('#add').click(() => {
  $('.form-group').append('<input class="form-control extra" type="text" name="answer' + iteration + '" placeholder="New option"/>');
  iteration++;
});

// Ensures a fresh start every time the new poll modal is open
$('#pollModal').on('hidden.bs.modal', (e) => {
  $('.extra').remove();
  $('original').text('');
  iteration = 3;
});
