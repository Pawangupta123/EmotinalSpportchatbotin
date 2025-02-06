export function setupVoiceRecognition(messageInput, micButton) {
  let recognition;
  try {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      messageInput.value = text;
      micButton.innerHTML = '<i class="bi bi-mic text-xl"></i>';
    };

    recognition.onend = () => {
      micButton.innerHTML = '<i class="bi bi-mic text-xl"></i>';
    };

    return () => {
      recognition.start();
      micButton.innerHTML = '<i class="bi bi-mic-fill text-xl text-red-500"></i>';
    };
  } catch (e) {
    console.log('Speech recognition not supported');
    micButton.style.display = 'none';
    return null;
  }
}
