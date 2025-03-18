const socket = io("http://localhost:3000");

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
const notificationSound = new Audio("notification.mp3");

const appendMessage = (message, position) => {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message", position);
    messageContainer.appendChild(messageElement);

    if (position === "left") {
        notificationSound.play();
    }
};

// Prompt for username
const username = prompt("Enter your name to join the chat");
socket.emit("new-user-joined", username);

socket.on("user-joined", (name) => {
    appendMessage(`${name} joined the chat`, "left");
});

socket.on("receive", (data) => {
    appendMessage(`${data.name}: ${data.message}`, "left");
});

socket.on("left", (name) => {
    appendMessage(`${name} left the chat`, "left");
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`, "right");
    socket.emit("send", message);
    messageInput.value = "";
});
