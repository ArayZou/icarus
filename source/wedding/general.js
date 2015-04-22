//enter the count down date using the format year, month, day, time:time
j$(".count-down").ccountdown(j$("#d_y").val(),j$("#d_m").val(),j$("#d_d").val(),j$("#d_h").val());

// Utilizing the Modernizr object created to implement placeholder functionality
function hasPlaceholderSupport() {
  var input = document.createElement('input');
  return ('placeholder' in input);
}

if (!Modernizr.input.placeholder) {
  j$('[placeholder]').focus(function() {
    var input = j$(this);
    if (input.val() == input.attr('placeholder')) {
      input.val('');
      input.removeClass('placeholder');
    }
  }).blur(function() {
    var input = j$(this);
    if (input.val() == '' || input.val() == input.attr('placeholder')) {
      input.addClass('placeholder');
      input.val(input.attr('placeholder'));
    }
  }).blur();
  j$('[placeholder]').parents('form').submit(function() {
    j$(this).find('[placeholder]').each(function() {
      var input = j$(this);
      if (input.val() == input.attr('placeholder')) {
        input.val('');
      }
    })
  });
}
j$('a[href="#"]').click(function(e) {
  e.preventDefault();
});

//Animate Section on Appear
j$(document).ready(function() {
  j$('.fade-down').each(function() {
    j$(this).appear(function() {
      j$(this).delay(1000).addClass('animated fadeInDown');
    });
  });

  j$("a.tool-tip").tooltip();   

});

// Contact Form Mail Functionality
j$(document).ready(function() {
  j$(".validate").validate();
  j$(document).on('submit', '.contact-form', function() {
    j$.ajax({
      url : 'contact.php',
      type : 'post',
      data : j$(this).serialize(),
      success : function(data) {
       j$('.form-respond').html("<div class='content-message success'><h2>Email Sent Successfully Your message has been submitted.</h2></div>");
     },
     error : function(xhr, err) {
      j$('.form-respond').html("<div class='content-message'><h2>Error sending Try again later.</h2></div>");
    }
  });
    return false;
  });
});