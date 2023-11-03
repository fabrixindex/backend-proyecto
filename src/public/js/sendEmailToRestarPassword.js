const form = document.getElementById('recoverForm');
const userEmail = document.getElementById('userEmail');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); 
    const email = userEmail.value;
    const actionURL = `/api/sessions/send-recover-mail/${email}`;

    try {
        const response = await fetch(actionURL, { method: 'GET' });
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Mail enviado!',
                text: 'Revisa tu correo electrónico.',
            }).then(() => {
                window.location.href = '/login';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo enviar el correo electrónico.',
            });
        }
    } catch (error) {
        console.error(error);
    }
});