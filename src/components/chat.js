import { sendMessage, analyzeImage } from '../utils/api.js';
import { createEmojiPicker } from '../utils/emoji.js';
import { setupVoiceRecognition } from '../utils/voice-recognition.js';

export function initializeChat() {
  const chatContainer = document.getElementById('chatContainer');
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');
  const micButton = document.getElementById('micButton');
  const imageUploadBtn = document.getElementById('imageUploadBtn');
  const imageInput = document.getElementById('imageInput');
  const emojiBtn = document.getElementById('emojiBtn');
  const emojiPicker = document.getElementById('emojiPicker');
  const emergencyBtn = document.getElementById('emergencyBtn');
  const moodButtons = document.querySelectorAll('.mood-btn');

  // Emoji Picker Setup
  createEmojiPicker(messageInput, emojiPicker);

  // Voice Recognition Setup
  const startVoiceRecognition = setupVoiceRecognition(messageInput, micButton);
  if (micButton && startVoiceRecognition) {
    micButton.onclick = startVoiceRecognition;
  }

  // Emergency Button
  emergencyBtn.addEventListener('click', () => {
    window.location.href = 'tel:988';
  });

  // Emoji Button Toggle
  emojiBtn.onclick = () => {
    emojiPicker.classList.toggle('active');
  };

  // Close emoji picker when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#emojiPicker') && !e.target.closest('#emojiBtn')) {
      emojiPicker.classList.remove('active');
    }
  });

  // Image Upload Handler
  imageUploadBtn.onclick = () => {
    imageInput.click();
  };

  imageInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        handleMessage(`[Analyzing image...]`);
        processImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mood Buttons
  moodButtons.forEach(btn => {
    btn.onclick = () => handleMessage(`I'm feeling ${btn.textContent.trim()}`);
  });

  // Message Handling
  async function handleMessage(message) {
    if (!message.trim()) return;
    
    addMessage(message, true);
    messageInput.value = '';

    const typingDiv = createTypingIndicator();
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
      const data = await sendMessage(message);
      chatContainer.removeChild(typingDiv);
      addMessage(data.message);
    } catch (error) {
      console.error('Error:', error);
      chatContainer.removeChild(typingDiv);
      addMessage("I apologize, but I'm having trouble processing your message. Please try again.");
    }
  }

  async function processImage(imageData) {
    try {
      const data = await analyzeImage(imageData);
      addMessage(data.message);
    } catch (error) {
      console.error('Image Analysis Error:', error);
      addMessage("I apologize, but I'm having trouble analyzing the image. Please try again or describe how you're feeling in words.");
    }
  }

  function createTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex items-start mb-4';
    typingDiv.innerHTML = `
      <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
        <i class="bi bi-robot"></i>
      </div>
      <div class="ml-3 bg-blue-50 p-3 rounded-lg">
        <p class="text-slate-800 typing-indicator">Thinking</p>
      </div>
    `;
    return typingDiv;
  }

  function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex items-start mb-4 ${isUser ? 'flex-row-reverse' : ''}`;
    messageDiv.innerHTML = `
      <div class="w-10 h-10 rounded-full ${isUser ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'} flex items-center justify-center text-white">
        <i class="bi ${isUser ? 'bi-person' : 'bi-robot'}"></i>
      </div>
      <div class="mx-3 ${isUser ? 'bg-gradient-to-r from-green-50 to-blue-50' : 'bg-blue-50'} p-3 rounded-lg max-w-[80%]">
        <p class="text-slate-800">${message}</p>
      </div>
    `;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Event Listeners
  sendButton.onclick = () => handleMessage(messageInput.value);
  messageInput.onkeypress = (e) => {
    if (e.key === 'Enter') handleMessage(messageInput.value);
  };
}
