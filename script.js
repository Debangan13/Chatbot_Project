const chatButton = document.querySelector('.chat-button');
const chatWindow = document.querySelector('.chat-window');
const messagesList = document.querySelector('.messages');
const userInput = document.getElementById('userInput');

const botResponses = {
  'hello': 'Hi there!,How can i help you',
  'how are you': 'I am doing well, thank you!',
  'what is your name': 'I am a simple chatbot.',
  'bye': 'Goodbye!',
  "i need help":"Sure! How can I assist you today?",
  'thank you': "You're welcome!",
  'what time is it': () => {
    const now = new Date();
    return `The current time is ${now.toLocaleTimeString()}`;
  }
};

function toggleChat() {
  chatWindow.style.display = chatWindow.style.display === 'none' ? 'block' : 'none';
}

function getBotResponse(userMessage) {
  const lowerCaseMessage = userMessage.toLowerCase();
  for (const [key, response] of Object.entries(botResponses)) {
    if (lowerCaseMessage.includes(key)) {
      return typeof response === 'function' ? response() : response;
    }
  }
  return "I don't understand.";
}

function showTypingIndicator() {
  const typingIndicator = document.createElement('li');
  typingIndicator.textContent = 'Bot is typing...';
  typingIndicator.classList.add('message', 'bot-message', 'typing-indicator');
  messagesList.appendChild(typingIndicator);
  return typingIndicator;
}

function hideTypingIndicator(typingIndicator) {
  messagesList.removeChild(typingIndicator);
}

function saveMessage(text, type) {
  const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
  storedMessages.push({ text, type });
  localStorage.setItem('chatMessages', JSON.stringify(storedMessages));
}

function loadMessages() {
  const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
  storedMessages.forEach(({ text, type }) => {
    const messageElement = document.createElement('li');
    messageElement.classList.add('message', type === 'user' ? 'user-message' : 'bot-message');

    const messageText = document.createElement('span');
    messageText.classList.add('message-text');
    messageText.textContent = text;

    messageElement.appendChild(messageText);
    messagesList.appendChild(messageElement);
  });
}

function sendMessage() {
  const userMessage = userInput.value;

  if (userMessage.trim() === '') {
    const errorMessage = document.createElement('li');
    errorMessage.classList.add('message', 'bot-message');

    const errorMessageText = document.createElement('span');
    errorMessageText.classList.add('message-text');
    errorMessageText.textContent = 'Please enter a message.';

    errorMessage.appendChild(errorMessageText);
    messagesList.appendChild(errorMessage);
    return;
  }

  saveMessage(userMessage, 'user');

  // Display user message
  const userMessageElement = document.createElement('li');
  userMessageElement.classList.add('message', 'user-message');

  const userMessageText = document.createElement('span');
  userMessageText.classList.add('message-text');
  userMessageText.textContent = userMessage;

  userMessageElement.appendChild(userMessageText);
  messagesList.appendChild(userMessageElement);

  userInput.value = '';

  // Show typing indicator
  const typingIndicator = showTypingIndicator();

  // Simulate bot response delay
  setTimeout(() => {
    hideTypingIndicator(typingIndicator);

    const botMessage = getBotResponse(userMessage);
    saveMessage(botMessage, 'bot');

    const botMessageElement = document.createElement('li');
    botMessageElement.classList.add('message', 'bot-message');

    const botMessageText = document.createElement('span');
    botMessageText.classList.add('message-text');
    botMessageText.textContent = botMessage;

    botMessageElement.appendChild(botMessageText);
    messagesList.appendChild(botMessageElement);

    messagesList.scrollTop = messagesList.scrollHeight;
  }, 1000);
}

// Load messages on page load
window.onload = loadMessages;
