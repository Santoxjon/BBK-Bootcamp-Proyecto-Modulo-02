if (location.pathname != "/contacts") {
    document.getElementById("new_contact").style.display = "none";
}

(loadFavs());

function loadFavs() {
    let stars = document.querySelectorAll(".star");
    stars.forEach(star => {
        let id = star.id.split("_")[1];
        let fav = false;
        let data = { id, fav };
        let url = "";
        let msg = "";

        star.onclick = (e) => {
            if (star.classList.contains("filled")) {
                url = `/contacts/${id}/unfav`;
                data.fav = false;
                star.classList.remove("filled");
                star.classList.add("empty");
                msg = "Removed from favs";
            }
            else {
                url = `/contacts/${id}/fav`;
                data.fav = true;
                star.classList.add("filled");
                star.classList.remove("empty");
                msg = "Add from favs";
            }

            let fetchData = {
                method: 'PUT',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify(data)
            };

            fetch(url, fetchData)
                .then((res) => res.json())
                .then(() => {
                    console.log(msg);
                });
            if (location.pathname === "/contacts/favs") {
                location.reload();
            }
            loadFavs();
        };
    });
}

function editContact() {
    let id = document.getElementById("id").value;
    let name = document.getElementById("name").value;
    let lastname = document.getElementById("lastname").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let address = document.getElementById("address").value;
    let zip = document.getElementById("zip").value;

    let url = `/contacts/edit/${id}`;
    let data = { name, lastname, phone, email, address, zip };

    let fetchData = {
        method: 'PUT',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify(data)
    }

    fetch(url, fetchData)
        .then((res) => res.json())
        .then(() => {
            location.replace('/contacts');
        });
}

function deleteContact(id) {
    if (confirm("Esta acción eliminará el contacto, estás seguro?")) {
        let url = `/contacts/${id}`;
        let data = { id };

        let fetchData = {
            method: 'DELETE',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify(data)
        }

        fetch(url, fetchData)
            .then((res) => res.json())
            .then(() => {
                location.replace('/contacts');
            });
    }
}