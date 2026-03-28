// js/form-handler.js

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  if (!form) {
    console.error('Form not found! Check that id="contact-form" exists');
    return;
  }
  console.log('Form found, adding submit handler');
  form.addEventListener('submit', handleSubmit);
});

function validateForm(data) {
  const errors = {};
  
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Please enter your name (at least 2 characters)';
  } else if (!/^[a-zA-Zа-яёЁ\s-]+$/i.test(data.name.trim())) {
    errors.name = 'Name can only contain letters';
  }
  
  const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  if (!data.email) {
    errors.email = 'Please enter your email';
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = 'Please enter a valid email';
  }
  
  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  } else if (data.message.length > 1000) {
    errors.message = 'Message cannot exceed 1000 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

function displayErrors(errors) {
  clearErrors();
  
  for (const [field, message] of Object.entries(errors)) {
    const input = document.getElementById(field);
    const errorDiv = document.querySelector(`.error-message[data-for="${field}"]`);
    
    if (input) {
      const formGroup = input.closest('.form-group');
      if (formGroup) formGroup.classList.add('error');
    }
    if (errorDiv) {
      errorDiv.textContent = message;
    }
  }
}

function clearErrors() {
  document.querySelectorAll('.form-group').forEach(group => {
    group.classList.remove('error');
  });
  document.querySelectorAll('.error-message').forEach(msg => {
    msg.textContent = '';
  });
}

async function handleSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitBtn = form.querySelector('.submit-btn');
  const statusDiv = document.getElementById('form-status');
  
  const formData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    message: document.getElementById('message').value.trim(),
    timestamp: new Date().toLocaleString('ru-RU')
  };
  
  console.log('📤 Sending data:', formData);
  
  const { isValid, errors } = validateForm(formData);
  if (!isValid) {
    displayErrors(errors);
    return;
  }
  
  clearErrors();
  statusDiv.innerHTML = '⏳ Sending...';
  statusDiv.className = 'form-status';
  submitBtn.disabled = true;
  
  // ⚠️ ВСТАВЬТЕ ВАШ URL ОТ GOOGLE APPS SCRIPT
  const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzQDJPtTf7P75NugOOkX4AnmoQPKIs51uztc5f4f3DyxgbtDajbWSHPO0tNI2hDWFUX/exec';
  
  try {
    console.log('📡 Sending to:', GOOGLE_SHEETS_URL);
    
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      mode: 'cors',  // Убираем no-cors!
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    console.log('📥 Response status:', response.status);
    
    const result = await response.json();
    console.log('📦 Response data:', result);
    
    if (result.success) {
      statusDiv.innerHTML = '✅ Message sent successfully! I will contact you soon.';
      statusDiv.className = 'form-status success';
      form.reset();
    } else {
      throw new Error(result.error || 'Unknown error');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    statusDiv.innerHTML = '❌ Failed to send message. Please try again or email me directly.';
    statusDiv.className = 'form-status error';
  } finally {
    submitBtn.disabled = false;
    setTimeout(() => {
      if (statusDiv) {
        statusDiv.innerHTML = '';
        statusDiv.className = 'form-status';
      }
    }, 5000);
  }
}