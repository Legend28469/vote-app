var iteration = 3;

$(document).ready(function() {
  var url = document.location.toString();
  if ( url.match('#') ) {
    var hash = url.split('#')[1];

    console.log(hash);
    // collapse the expanded panel
    // $('#accordion .accordion-collapse').removeClass('in');

    // expand the requested panel
    $('#' + hash + '_c').addClass('in');
  }
});

$('#add').click(() => {
  $('.form-group').append('<input class="form-control extra" type="text" name="answer' + iteration + '" placeholder="New option"/>');
  iteration++;
});

$('#pollModal').on('hidden.bs.modal', (e) => {
  $('.extra').remove();
  $('original').text('');
  iteration = 3;
});
