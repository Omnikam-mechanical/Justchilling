document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if(name && email && message) {
      alert("Thank you for your message, " + name + "!");
      document.getElementById('contact-form').reset();
    } else {
      alert("Please fill in all fields!");
    }
  });
  document.querySelector('.live-preview-btn').addEventListener('click', () => {
      const fileInput = document.getElementById('designUpload');
      const textInput = document.getElementById('textAdd');
      const previewImage = document.getElementById('previewImage');
      const previewText = document.getElementById('previewText');
  
      // Image Preview
      const file = fileInput.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
              previewImage.src = e.target.result;
          };
          reader.readAsDataURL(file);
      }
  
      // Text Preview
      previewText.textContent = textInput.value;
  });
  
  