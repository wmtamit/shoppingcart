// var stripe = Stripe('pk_test_LSXQiP921y9Bg96VM63MFhsB');
// var elements = stripe.elements();
Stripe.setPublishableKey('pk_test_LSXQiP921y9Bg96VM63MFhsB');
var $form = $("#checkout-form");
// console.log(StripePubKey)
$form.submit(function(event) {
    // console.log(StripePubKey)
    // $('#invalid-feedback').addAttr('hidden');
  $form.find("button").prop("disabled", true);
  Stripe.card.createToken({
    number: $('#cardnumber').val(),
    cvc: $('#csv').val(),
    exp_month: $('#exmonth').val(),
    exp_year: $('#exyear').val()
  }, stripeResponseHandler);
  return false
});


function stripeResponseHandler(status, response) {
    if (response.error) { // Problem!

        // Show the errors on the form
        $('#invalid-feedback').text(response.error.message);
        $('#invalid-feedback').removeAttr('hidden');
        $form.find('button').prop('disabled', false); // Re-enable submission
        
      } else { // Token was created!
    
        // Get the token ID:
        var token = response.id;
    
        // Insert the token into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));
    
        // Submit the form:
        $form.get(0).submit();
    
      }
    

}
