emailjs.init({
    publicKey: "OXXoywtQ9_lhBe8ut",
});

console.log("contact.js chargé");

const form = document.getElementById("contactForm");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const params = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };

    emailjs.send(
        "service_cpd0l2f",
        "template_5djoari",
        params
    )
    .then((response) => {
        console.log("SUCCESS!", response);
        alert("Message envoyé avec succès !");
        form.reset();
    })
    .catch((error) => {
        console.error("FAILED...", error);
        alert("Erreur : " + JSON.stringify(error));
    });
});