document.addEventListener('DOMContentLoaded', function () {
  const socket = io('http://localhost:3000'); 

  socket.on('connect', () => {
    console.log('Conectado ao servidor!');
  });

  socket.on('msgToClient', (message, username, clientId) => {
    console.log(`Mensagem recebida: ${message} do cliente ${username}`);
    const messages = document.getElementById('messages');
    const messageElement = document.createElement('li');
    messageElement.textContent = `Cliente ${username}: ${message}`;
    messages.appendChild(messageElement);
  });

  document.getElementById('sendButton').addEventListener('click', function () {
    const usernameInput = document.getElementById('usernameInput');
    const messageInput = document.getElementById('messageInput');
    const username = usernameInput.value.trim();
    const message = messageInput.value.trim();

    if (!username) {
      alert('Por favor, insira seu nome antes de enviar uma mensagem.');
      return;
    }

    if (message) {
      socket.emit('msgToServer', { content: message, username: username });
      messageInput.value = '';
    }
  });
});
