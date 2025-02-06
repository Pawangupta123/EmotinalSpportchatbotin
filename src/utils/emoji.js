export const emojis = [
  '😊', '😢', '😡', '😔', '😃', '🤗', 
  '😌', '😕', '😳', '🥺', '😤', '😇', 
  '🙂', '😩', '😍', '😐'
];

export function createEmojiPicker(messageInput, emojiPicker) {
  emojis.forEach(emoji => {
    const button = document.createElement('button');
    button.textContent = emoji;
    button.className = 'text-xl hover:bg-gray-100 p-1 rounded';
    button.onclick = () => {
      messageInput.value += emoji;
      emojiPicker.classList.remove('active');
    };
    emojiPicker.appendChild(button);
  });
}
