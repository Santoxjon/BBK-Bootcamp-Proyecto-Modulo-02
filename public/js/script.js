if (location.pathname != "/contacts") {
    document.querySelector("#new_contact").style.display = "none";
    if (document.querySelector('#search_form')) document.querySelector('#search_form').action = "/contacts/search/favs";
}

(loadQRListeners());

(loadFavs());

function loadQRListeners() {
    let prof_pics = document.querySelectorAll(".prof-pic");
    prof_pics.forEach(prof_pic => {
        let contact_id = prof_pic.id.split('_')[1];

        prof_pic.parentElement.onmouseover = (e) => {
            prof_pic.style.display = "none";
            let qr = document.getElementById(`qr_${contact_id}`);
            qr.style.display = "block";
            prof_pic.parentElement.style.cursor = "none";
        };
        prof_pic.parentElement.onmouseout = (e) => {
            prof_pic.style.display = "block";
            let qr = document.getElementById(`qr_${contact_id}`);
            qr.style.display = "none";
            prof_pic.parentElement.style.cursor = "cursor";
        };
    });
}

function loadFavs() {
    let stars = document.querySelectorAll(".star");
    stars.forEach(star => {
        let id = star.id.split("_")[1];
        let fav = false;
        let data = { id, fav };
        let url = "";

        star.onclick = (e) => {
            if (star.classList.contains("filled")) {
                url = `/contacts/${id}/unfav`;
                data.fav = false;
                star.classList.remove("filled");
                star.classList.add("empty");
            }
            else {
                url = `/contacts/${id}/fav`;
                data.fav = true;
                star.classList.add("filled");
                star.classList.remove("empty");
            }

            let fetchData = {
                method: 'PUT',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify(data)
            };

            fetch(url, fetchData)
                .then((res) => res.json())
                .then(() => {
                    if (location.pathname === "/contacts/favs") {
                        location.reload();
                    }
                });
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
            location.replace(`/contacts`);
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
                location.reload();
            });
    }
}