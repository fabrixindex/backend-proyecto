const socket = io();

let chatBox = document.getElementById("chatBox");
let user = userEmail

socket.emit(`authenticated`, user);

chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

socket.on(`newUserConnected`, (data) => {
  if (!user) return;
  Swal.fire({
    toast: true,
    position: `top-end`,
    showConfirmButton: false,
    timer: 3000,
    title: `${data} se ha unido`,
    icon: `success`,
  });
});

/*--------------------------------------------- MESSAGE LISTENER ------------------------------------------------------*/

socket.on("messageLogs", (data) => {
  if (!user) return;
  let log = document.getElementById("messageLogs");
  let messages = "";
  data.forEach((message) => {
    messages += `${message.user} dice: ${message.message}<br/>`;
  });
  log.innerHTML = messages;
});
