const form = document.getElementById("volunteerForm");

form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop page reload

    const name = form.querySelector('input[type="text"]').value;
    const phone = form.querySelector('input[type="tel"]').value;
    const consent = form.querySelector('input[type="checkbox"]').checked;

    if (!consent) {
        alert("You must accept the risk and terms to proceed.");
        return;
    }

    const volunteerData = {
        name: name,
        phone: phone,
        consent: consent
    };

    fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(volunteerData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        form.reset();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to submit registration.");
    });
});

const locationBtn = document.getElementById("locationBtn");
const locationStatus = document.getElementById("locationStatus");

let userLocation = null;

locationBtn.addEventListener("click", function () {
    if (!navigator.geolocation) {
        locationStatus.innerText = "Geolocation is not supported by your browser.";
        return;
    }

    locationStatus.innerText = "Requesting location permission...";

    navigator.geolocation.getCurrentPosition(
        function (position) {
            userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            locationStatus.innerText =
                `Location received (lat: ${userLocation.latitude.toFixed(4)}, 
                lng: ${userLocation.longitude.toFixed(4)})`;
        },
        function () {
            locationStatus.innerText = "Location access denied.";
        }
    );
});

const disasterForm = document.getElementById("disasterForm");

disasterForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!userLocation) {
        alert("Please share your location before submitting a report.");
        return;
    }

    const inputs = disasterForm.querySelectorAll("input, select, textarea");

    const reportData = {
        disasterNearby: inputs[0].value,
        disasterType: inputs[1].value,
        severity: inputs[2].value,
        reliefCamp: inputs[3].value,
        needs: inputs[4].value,
        location: userLocation
    };

    fetch("http://localhost:5000/report", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reportData)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        disasterForm.reset();
    })
    .catch(err => {
        console.error(err);
        alert("Failed to submit disaster report.");
    });
});
