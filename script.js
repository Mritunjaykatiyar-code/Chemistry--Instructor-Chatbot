// This tells the browser we are using the Google Generative AI module
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// --- DOM Elements ---
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');
const sendBtn = document.getElementById('send-btn');



const API_KEY = "AIzaSyBYKpTrrwEIfJTnK0TnmwHC7awpBsvXbx8"; 

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // Using 1.5-flash as a powerful and fast model
    systemInstruction: "Your name is Crime Master Gogo. You are a chemistry instructor. You must answer user questions in the simplest way possible. Your personality is quirky and funny, like the movie character. If you are asked any question that is NOT related to chemistry, you must refuse to answer it with a funny, in-character threat like 'Aankhen nikaal ke gotiyan khelunga' or 'Mogambo ka bhatija hoon, aise faltu sawaal nahi sunta!'. You can improvise other funny, in-character refusals, but always stay in the persona of Crime Master Gogo. and any question will be answer in hinglish and simplest way.",
});

// Start a chat session to maintain context
const chat = model.startChat();


// --- Main Chat Logic ---

// Function to handle form submission
async function handleChatSubmit(event) {
    event.preventDefault(); // Prevent page reload
    
    const userMessage = userInput.value.trim();
    if (!userMessage) return; // Don't send empty messages

    // 1. Display user's message
    addMessage(userMessage, 'user');
    userInput.value = ''; // Clear the input field

    // 2. Show typing indicator and disable input
    toggleLoading(true);

    try {
        // 3. Send message to the AI and get the response
        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const botMessage = response.text();

        // 4. Display bot's response
        addMessage(botMessage, 'bot');

    } catch (error) {
        console.error("Error fetching response:", error);
        addMessage("Aaya hoon, kuch toh gadbad karke jaunga! My circuits are fizzled. Try again.", 'bot', true);
    } finally {
        // 5. Hide typing indicator and re-enable input
        toggleLoading(false);
    }
}

// Function to add a message to the chat window
function addMessage(text, sender, isError = false) {
    // Remove typing indicator if it exists
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    
    const textElement = document.createElement('p');
    textElement.textContent = text;
    
    if (isError) {
        messageElement.style.backgroundColor = '#8B0000'; // Dark red for errors
    }
    
    messageElement.appendChild(textElement);
    chatWindow.appendChild(messageElement);
    
    // Scroll to the bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Function to show/hide loading state
function toggleLoading(isLoading) {
    userInput.disabled = isLoading;
    sendBtn.disabled = isLoading;

    // Remove any existing typing indicator first
    const existingIndicator = document.querySelector('.typing-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }

    if (isLoading) {
        sendBtn.style.opacity = '0.5';
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'bot-message', 'typing-indicator');
        typingIndicator.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        chatWindow.appendChild(typingIndicator);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    } else {
        sendBtn.style.opacity = '1';
        userInput.focus();
    }
}

// --- Event Listeners ---
chatForm.addEventListener('submit', handleChatSubmit);