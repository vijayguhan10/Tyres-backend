const axios = require('axios');

axios.post('https://api.gupshup.io/sm/api/v1/msg', {
  channel: 'whatsapp',
  source: '15557732730',
  destination: '918438434868',
  message: { type: 'text', text: 'Hello from Gupshup' },
}, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'apikey': 'YOUR_API_KEY',
  }
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
