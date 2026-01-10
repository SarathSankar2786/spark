/* =========================================================
   SECTION 1: UTILITY FUNCTIONS (UNCHANGED LOGIC)
========================================================= */

function classify(value, safe, caution) {
    if (value <= safe) return "safe";
    if (value <= caution) return "caution";
    return "danger";
}

function setBadge(id, status) {
    const el = document.getElementById(id);
    el.textContent = status.toUpperCase();
    el.className = "badge " + status;
}

/* =========================================================
   SECTION 2: GLOBAL VARIABLES FOR LIVE TRACKING
========================================================= */

let watchId = null;            // ID returned by watchPosition
let lastUpdateTime = 0;        // Used for throttling
const UPDATE_INTERVAL = 30000; // 30 seconds (efficient)

/* =========================================================
   SECTION 3: CORE WEATHER + SAFETY LOGIC
   (Now accepts live latitude & longitude)
========================================================= */

async function loadData(lat, lon) {

    /* -------- OPEN-METEO WEATHER -------- */
    const meteoURL =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure`;

    const meteo = await fetch(meteoURL).then(r => r.json());
    const c = meteo.current;

    document.getElementById("wind").textContent = c.wind_speed_10m;
    document.getElementById("temp").textContent = c.temperature_2m;
    document.getElementById("humidity").textContent = c.relative_humidity_2m;
    document.getElementById("sea").textContent = c.surface_pressure;

    /* -------- USGS SEISMIC DATA -------- */
    const usgs = await fetch(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
    ).then(r => r.json());

    const mag = usgs.features[0]?.properties.mag || 0;
    document.getElementById("seismic").textContent = mag;

    /* -------- SAFETY ANALYSIS -------- */
    let danger = false;

    const windS = classify(c.wind_speed_10m, 30, 50);
    setBadge("windStatus", windS);
    if (windS === "danger") danger = true;

    const tempS = classify(c.temperature_2m, 40, 45);
    setBadge("tempStatus", tempS);
    if (tempS === "danger") danger = true;

    const humS = classify(c.relative_humidity_2m, 70, 85);
    setBadge("humidityStatus", humS);
    if (humS === "danger") danger = true;

    const seaS =
        c.surface_pressure >= 990 ? "safe" :
        c.surface_pressure >= 970 ? "caution" : "danger";
    setBadge("seaStatus", seaS);
    if (seaS === "danger") danger = true;

    const seiS = classify(mag, 3.9, 4.9);
    setBadge("seismicStatus", seiS);
    if (seiS === "danger") danger = true;

    /* -------- OVERALL STATUS -------- */
    const overall = document.getElementById("overallStatus");

    if (danger) {
        overall.textContent =
            "⚠️ You are prone to danger. Please seek help immediately.";
        overall.className = "overall danger";
    } else {
        overall.textContent =
            "✅ You are currently not prone to danger. Would you like to lend a hand to help the needy?";
        overall.className = "overall safe";
    }
}

/* =========================================================
   SECTION 4: LIVE LOCATION TRACKING (watchPosition)
========================================================= */

function startLiveTracking() {

    /* ❌ Prevent file:// misuse */
    if (location.protocol === "file:") {
        alert(
            "Please run this site using Live Server or http://localhost.\n\n" +
            "Live location tracking is blocked for file://"
        );
        return;
    }

    /* ❌ Browser support check */
    if (!("geolocation" in navigator)) {
        alert("Geolocation is not supported in this browser.");
        return;
    }

    /* ✅ Start live tracking */
    watchId = navigator.geolocation.watchPosition(

        position => {
            const now = Date.now();

            /* ⏱ Throttle updates for efficiency */
            if (now - lastUpdateTime < UPDATE_INTERVAL) return;
            lastUpdateTime = now;

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            console.log("Live location:", lat, lon);

            loadData(lat, lon);
        },

        error => {
            console.error("Location error:", error);
            alert("Unable to access live location.");
        },

        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 15000
        }
    );
}

/* =========================================================
   SECTION 5: STOP LIVE TRACKING (OPTIONAL BUT IMPORTANT)
========================================================= */

function stopLiveTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        console.log("Live tracking stopped");
    }
}

/* =========================================================
   SECTION 6: NAVIGATION (UNCHANGED)
========================================================= */

function goToHelp() {
    window.location.href = "need-help.html";
}

function goToVolunteer() {
    window.location.href = "volunteer.html";
}

/* =========================================================
   SECTION 7: APP INITIALIZATION
========================================================= */

startLiveTracking();
