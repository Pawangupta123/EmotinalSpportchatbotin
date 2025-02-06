const API_URL = 'https://r0c8kgwocscg8gsokogwwsw4.zetaverse.one/ai';
const API_TOKEN = 'Bearer aUeuBYbEFoRhnOaTLUPqWcyH4Qa2';

export async function sendMessage(message) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: [{
            type: 'text',
            text: `Act as an empathetic emotional support AI. User message: ${message}`
          }]
        }]
      })
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { message: "I apologize, but I'm having trouble processing your message. Please try again." };
  }
}

export async function analyzeImage(imageData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: "What emotions do you see in this image? Provide an empathetic response."
            },
            {
              type: 'image_url',
              image_url: {
                url: imageData
              }
            }
          ]
        }]
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Image Analysis Error:', error);
    return { message: "I apologize, but I'm having trouble analyzing the image. Please try again or describe how you're feeling in words." };
  }
}
