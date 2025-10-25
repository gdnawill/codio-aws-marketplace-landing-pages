const form = document.querySelector('.registration-form');
const showAlert = (cssClass, message) => {
  const html = `
    <div class="alert alert-${cssClass} alert-dismissible" role="alert">
        <strong>${message}</strong>
        <button class="close" type="button" onclick="this.parentElement.remove()" aria-label="Close">
            <span aria-hidden="true">×</span>
        </button>
    </div>`;
  document.querySelector('#alert').innerHTML += html;
};

const formToJSON = (elements) => [].reduce.call(elements, (data, element) => {
  if (element.name) {
    data[element.name] = element.value;
  }
  return data;
}, {});

const getUrlParameter = (name) => {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  const postUrl = `/subscriber`;
  const regToken = getUrlParameter('x-amzn-marketplace-token');
  
  if (!regToken) {
    showAlert('danger',
      'Registration Token Missing. Please go to AWS Marketplace and follow the instructions to set up your account!');
  } else {
    const data = formToJSON(form.elements);
    data.regToken = regToken;
    
    // Combine first and last name for contactPerson field (for compatibility)
    data.contactPerson = `${data.firstName} ${data.lastName}`;
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    // Disable submit button during request
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Complete Registration';
        
        if (xhr.status === 200) {
          showAlert('primary', 'Registration successful! You will receive further instructions via email.');
          form.reset();
        } else {
          showAlert('danger', xhr.responseText || 'Registration failed. Please try again.');
        }
        console.log('Registration response:', xhr.responseText);
      }
    };
  }
};

form.addEventListener('submit', handleFormSubmit);

// Check for registration token on page load
const regToken = getUrlParameter('x-amzn-marketplace-token');
if (!regToken) {
  showAlert('danger', 'Registration Token Missing. Please go to AWS Marketplace and follow the instructions to set up your account!');
}