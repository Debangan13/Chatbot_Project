const chatButton = document.querySelector('.chat-button');
const chatWindow = document.querySelector('.chat-window');
const messagesList = document.querySelector('.messages');
const userInput = document.getElementById('userInput');

let lastIntent = null; // Context memory

const botResponses = [
  {
    intent: "greeting",
    keywords: ["hello", "hi", "hey", "good morning", "good evening"],
    response: "Hi there! How can I assist you with astrology today?"
  },
  {
    intent: "recommendation",
    keywords: ["recommend", "suggest", "give me", "any advice"],
    response: 'Sure! You can check out our <a href="/astrology-services">astrology services</a> for personalized insights.'
  },
  {
    intent: "astrology_reading",
    keywords: ["zodiac", "horoscope", "birth chart", "astrology reading", "i want a reading"],
    response: () => {
      lastIntent = "reading_type_prompt";
      return "What type of reading are you interested in? Natal, love, or career?";
    }
  },
  {
    intent: "daily_horoscope",
    keywords: ["today's horoscope", "daily horoscope", "horoscope for today"],
    response: 'Check your daily horoscope on our <a href="/daily-horoscope">Daily Horoscope</a> page!'
  },
  {
    intent: "zodiac_signs",
    keywords: [
      "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra",
      "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
    ],
    response: 'We have detailed profiles for each zodiac sign <a href="/zodiac-signs">here</a>.'
  },
  {
    intent: "birth_chart",
    keywords: ["birth chart", "natal chart", "kundli", "janam kundli"],
    response: 'Want to generate your birth chart? Head over to our <a href="/birth-chart">Birth Chart Generator</a>!'
  },
  {
    intent: "personal_help",
    keywords: ["need help", "can you help", "assist me", "i need help"],
    response: "Of course! What would you like to know about astrology?"
  },
  {
    intent: "thanks",
    keywords: ["thank you", "thanks", "appreciate it"],
    response: "You're welcome! 🌟"
  },
  {
    intent: "goodbye",
    keywords: ["bye", "see you", "goodbye"],
    response: "Goodbye! Hope the stars guide you well ✨"
  },
  {
    intent: "time",
    keywords: ["what time is it", "current time"],
    response: () => {
      const now = new Date();
      return `The current time is ${now.toLocaleTimeString()}`;
    }
  }
];

function toggleChat() {
  chatWindow.style.display = chatWindow.style.display === 'none' ? 'block' : 'none';
}

function getBotResponse(message) {
  const lowerMsg = message.toLowerCase();

  // Check context-based follow-ups
  if (lastIntent === "reading_type_prompt") {
    if (lowerMsg.includes("natal")) {
      lastIntent = null;
      return 'Great! Get your natal reading here: <a href="/natal-reading">Natal Reading</a>';
    } else if (lowerMsg.includes("love")) {
      lastIntent = null;
      return 'Wonderful! Discover love compatibility <a href="/love-reading">here</a>.';
    } else if (lowerMsg.includes("career")) {
      lastIntent = null;
      return 'Explore your career astrology reading <a href="/career-reading">here</a>.';
    } else {
      return "Please choose one: Natal, Love, or Career.";
    }
  }

  // Regular intent matching
  for (const { intent, keywords, response } of botResponses) {
    if (keywords.some(keyword => lowerMsg.includes(keyword))) {
      lastIntent = intent;
      return typeof response === 'function' ? response() : response;
    }
  }

  // Fallback
  if (lowerMsg.includes("product")) {
    return 'You can view our products <a href="/products">here</a>.';
  }

  return "I'm not sure I understand. Could you rephrase or ask about your zodiac or horoscope?";
}

function showTypingIndicator() {
  const li = document.createElement('li');
  li.textContent = 'Bot is typing...';
  li.className = 'message bot-message typing-indicator';
  messagesList.appendChild(li);
  return li;
}

function hideTypingIndicator(indicator) {
  messagesList.removeChild(indicator);
}

function saveMessage(text, type) {
  const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
  messages.push({ text, type });
  localStorage.setItem('chatMessages', JSON.stringify(messages));
}

function loadMessages() {
  const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
  messages.forEach(({ text, type }) => {
    addMessage(text, type);
  });
  messagesList.scrollTop = messagesList.scrollHeight;
}

function addMessage(text, type) {
  const li = document.createElement('li');
  li.className = `message ${type}-message`;

  const span = document.createElement('span');
  span.className = 'message-text';
  span.innerHTML = text;

  li.appendChild(span);
  messagesList.appendChild(li);
  messagesList.scrollTop = messagesList.scrollHeight;
}

function sendMessage() {
  const userMessage = userInput.value.trim();
  if (userMessage === '') return;

  addMessage(userMessage, 'user');
  saveMessage(userMessage, 'user');
  userInput.value = '';

  const typingIndicator = showTypingIndicator();

  setTimeout(() => {
    hideTypingIndicator(typingIndicator);
    const botMessage = getBotResponse(userMessage);
    addMessage(botMessage, 'bot');
    saveMessage(botMessage, 'bot');
  }, 1000);
}

function handleEnter(event) {
  if (event.key === 'Enter') sendMessage();
}

window.onload = loadMessages;
