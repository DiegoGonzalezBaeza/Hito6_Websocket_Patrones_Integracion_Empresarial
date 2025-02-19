// const username = prompt("Enter your username:");
const token = prompt("Enter your token:");

const socket = io("/chat", {
  auth: {
    token,
  },
});

socket.on("connect", () => {
  console.log("Connected to server");
  // socket.emit("join", username);
});

socket.on("connect_error", (err) => {
  if (err.message === "Authentication error") {
    alert("Authentication error: Please provide a valid token.");
  } else {
    console.error("Connection error:", err.message);
  }
});

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const userList = document.getElementById("users");

let roomName = "";

socket.on("users", (users) => {
  userList.innerHTML = "";

  users.forEach(({ email }) => {
    const item = document.createElement("li");
    item.textContent = email;
    userList.appendChild(item);
  });

  console.log("Users", users);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!roomName) {
    alert("You must join a room first!");
    return;
  }

  if (input.value) {
    socket.emit("sendMessage", { room: roomName, message: input.value });
  }
  form.reset();
});

const joinRoom = (room) => {
  roomName = room;
  // Unirse a una sala
  socket.emit("joinRoom", roomName);
};

// Escuchar mensajes de la sala
socket.on("message", (messageData) => {
  const { username, content, room } = messageData;

  const item = document.createElement("li");
  item.textContent = `${room} - ${username}: ${content}`;
  messages.appendChild(item);
});

// Salir de la sala
const leaveRoom = () => {
  socket.emit("leaveRoom", roomName);
  roomName = "";
  console.log("Sala abandonada");

  // Limpiar mensajes
  messages.innerHTML = "";
};
