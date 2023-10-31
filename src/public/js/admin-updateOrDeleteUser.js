document.addEventListener("DOMContentLoaded", () => {
    const changeUserRole = async (event) => {
      try {
        const userId = event.target.dataset.id;
  
        const response = await fetch(
          `http://localhost:8080/api/sessions/premium/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (response.ok) {
          Swal.fire({
            title: `Rol del usuario cambiado exitosamente! 😀`,
            icon: "success",
          }).then(() => {
            window.location.href = '/updateOrDeleteUser';
          });
        } else {
          Swal.fire({
            title: "Hemos tenido un error 😡",
            icon: "error",
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    const changeUserRoleButtons = document.querySelectorAll(".change-role-button");
    changeUserRoleButtons.forEach((button) => {
      button.addEventListener("click", changeUserRole);
    });
  });
  
  const deleteUserButton = document.getElementById("delete-button");

deleteUserButton.addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:8080/api/sessions/markAsDeletedIfInactive", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      Swal.fire({
        title: "Usuarios marcados como eliminados si corresponde 😭",
        icon: "success",
      }).then(() => {
        window.location.href = "/updateOrDeleteUser";
      });
    } else {
      Swal.fire({
        title: "Hemos tenido un error 😡",
        icon: "error",
      });
    }
  } catch (error) {
    console.log(error);
  }
});
