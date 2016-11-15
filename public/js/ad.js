
function displayNumber(data) {

}

$('#theAd').on('click', function() {
  $.getJSON('/getnumber?ad=123', function(results) {
    window.location.assign("tel:+" + results.number);
  });
});
