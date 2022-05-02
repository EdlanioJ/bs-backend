export default [
  {
    subject: 'Welcome to beauty Space',
    type: 'welcome-email',
    body: '<strong>Hello, {{name}}, welcome to beauty Space!</strong><br/><p>Now you can make yours appointments to the services you want</p>',
  },
  {
    subject: 'Forgot password',
    type: 'forgot-password',
    body: "<strong>Hello, {{name}}, you have requested to reset your password</strong><br/><p>Please click on the link below to reset your password</p><p><a href='https://bs-b.herokuapp.com/auth/password/reset/{{token}}'>Reset Password</a></p>",
  },
  {
    subject: 'Appointment Confirmation',
    type: 'appointment-confirmation',
    body: '<strong>Hello, {{name}}, your appointment has been confirmed</strong><br/><p>You will receive a confirmation email when your appointment is confirmed</p>',
  },
  {
    subject: 'Appointment Cancellation',
    type: 'appointment-cancellation',
    body: '<strong>Hello, {{name}}, your appointment has been cancelled</strong><br/><p>You will receive a confirmation email when your appointment is cancelled</p>',
  },
  {
    type: 'reset-password-success',
    subject: 'Password Reset Success',
    body: '<strong>Hello, {{name}}, your password has been reset successfully</strong><br/><p>You can now login with your new password</p>',
  },
  {
    type: 'connection-request-email',
    subject: 'Connection Request',
    body: "<strong>Hello, {{name}}, you have a new connection request from {{providerName}}</strong><br/><p>Please click on the link below to view your connection request</p><p><a href='https://bs-b.herokuapp.com/connection/{{connectionId}}'>View Connection Request</a></p>",
  },
  {
    type: 'manager-accepted-email',
    subject: 'Manager Request Accepted',
    body: '<strong>Hello, {{name}}, manager request has accepted</strong><br/><p>Please enter into our platform and create your provider to start manager service.</p>',
  },
  {
    type: 'manager-rejected-email',
    subject: 'Manager Request Rejected',
    body: '<strong>Hello, {{name}}, manager request has rejected</strong><br/><p>Unfortunately you request was rejected for {{reason}}.</p>',
  },
];
