  $(document).ready(function() {
    $('.message-form').on('submit', function(e) {
      e.preventDefault(); // Prevent the default form submission

      var message = $('.message-input').val(); // Get the message input value


      $.ajax({
        type: 'POST',
        url: '/chat/',
        data: {
          message: message,
          csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val() // Include CSRF token
        },
        success: function(response) {
          // Handle success response here if needed
            console.log(response[1])
                    $('#chat-messages').html(response[0]);

            const botMessageDiv = document.createElement('div');
    botMessageDiv.classList.add('bot-message');
    botMessageDiv.textContent = 'Bot: ' + response.output.toString();



          console.log('Message sent successfully!');
        },
        error: function(xhr, errmsg, err) {
          console.log('Error sending message:', errmsg);
        }
      });

      $('.message-input').val('');
    });
  });