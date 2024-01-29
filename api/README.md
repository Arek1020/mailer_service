# mailer_service

<!-- This project is simple service written in TypeScript to sending mails. 
If you want to send mail on '/send' endpoint, first you must to get your authorization key.

How to get authorization key: 
  1) send POST request on '/authorize' with payload: {userCode: 'EXAMPLECODE'}
  2) if your userCode is correct you will receive an JWT token
  3) pass JWT token as Authorization header to all your requests

Tech stack: 
  - TypeScript
  - Express
  - MySql -->
