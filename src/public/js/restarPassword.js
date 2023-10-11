const form = document.getElementById("restarPasswordForm");

form.addEventListener('submit', e => {
    e.preventDefault();

     const newPassword = document.querySelector("input[name='new-password']").value;
     const token = e.target.dataset.user;

     const data = {
        password: newPassword,
    };

    fetch(`/api/sessions/pass-change/${token}`, {
        method: "PUT", 
        body: JSON.stringify(data),
        headers: {
            'Content-Type' : 'application/json'
        }
    }).then(result => {
        if(result.status === 200){
            Swal.fire({
                icon: 'success',
                title: 'Contraseña cambiada con éxito',
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error al cambiar la contraseña',
                text: 'Hubo un problema al cambiar la contraseña.',
            });
        }
    }).catch(error => {
        console.error("Error en la solicitud:", error);
    });
});