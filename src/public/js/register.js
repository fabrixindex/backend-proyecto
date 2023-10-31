const form = document.getElementById('registerForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = form.querySelector('input[name="first_name"]').value;
    const lastName = form.querySelector('input[name="last_name"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const age = form.querySelector('input[name="age"]').value;
    const password = form.querySelector('input[name="password"]').value;

    if (!firstName || !lastName || !email || !age || !password) {
        Swal.fire({
            title: "Please complete all fields!",
            icon: "warning",
        });
        return; 
    }

    const obj = {
        first_name: firstName,
        last_name: lastName,
        email,
        age,
        password,
    };

    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((result) => result.json())
    .then((json) => {
        console.log(json);
        Swal.fire({
            title: `Successfully registered user! 😀`,
            icon: "success",
        });
    });
});
