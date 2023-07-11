const socket = io();

let user;
let chatBox = document.getElementById("chatBox");

Swal.fire({
  title: "Ingresa tu correo electronico 😀",
  input: "text",
  text: "Ingresa el usuario para identificarte en el chat",
  icon: "success",

  inputValidator:(value) => {
    return !value && "Necesitas escribir un nombre de usuario para continuar!!"
  },

  allowOutsideClick: false

}).then(result =>{
  user = result.value;
  socket.emit(`authenticated`, user)
});

chatBox.addEventListener('keyup', evt => {
  if (evt.key === "Enter") {
      if (chatBox.value.trim().length > 0) {
          socket.emit('message', { user: user, message: chatBox.value });
          chatBox.value = "";
      }
  }
});

socket.on(`newUserConnected`, data => {
  if (!user) return;
  Swal.fire({
    toast: true,
    position: `top-end`,
    showConfirmButton: false,
    timer: 3000,
    title: `${data} se ha unido`,
    icon: `success`
  })
});

/*--------------------------------------------- MESSAGE LISTENER ------------------------------------------------------*/

socket.on('messageLogs', data => {
    if (!user) return;
    let log = document.getElementById('messageLogs');
    let messages = "";
    data.forEach(message => {
        messages += `${message.user} dice: ${message.message}<br/>`
    })
    log.innerHTML = messages;
})