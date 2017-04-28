var iteration = 3;

$('#add').click(() => {
  $('.form-group').append('<input class="form-control extra" type="text" name="answer' + iteration + '" placeholder="New option"/>');
  iteration++;
});

$('#pollModal').on('hidden.bs.modal', (e) => {
  $('.extra').remove();
  $('original').text('');
  iteration = 3;
});
