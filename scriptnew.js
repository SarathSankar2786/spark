/* =====================================================
   SECTION 1: UTILITY FUNCTIONS (UNCHANGED)
===================================================== */

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

/* =====================================================
   SECTION 2: MORE OPTIONS PANEL (UNCHANGED)
===================================================== */

function toggleMorePanel() {
    document.getElementById("morePanel").classList.toggle("hidden");
}

/* =====================================================
   SECTION 3: CORE WEATHER + SAFETY LOGIC (UNCHANGED)
===================================================== */

async function loadData(latitude, longitude) {

    const meteoURL =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure`;

    const meteo = await fetch(meteoURL).then(r => r.json());
    const c = meteo.current;

    document.getElementById("wind").textContent = c.wind_speed_10m;
    document.getElementById("temp").textContent = c.temperature_2m;
    document.getElementById("humidity").textContent = c.relative_humidity_2m;
    document.getElementById("sea").textContent = c.surface_pressure;

    const usgs = await fetch(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
    ).then(r => r.json());

    const mag = usgs.features[0]?.properties.mag || 0;
    document.getElementById("seismic").textContent = mag;

    let danger = false;

    const windS = classify(c.wind_speed_10m, 30, 50);
    setBadge("windStatus", windS); if (windS === "danger") danger = true;

    const tempS = classify(c.temperature_2m, 40, 45);
    setBadge("tempStatus", tempS); if (tempS === "danger") danger = true;

    const humS = classify(c.relative_humidity_2m, 70, 85);
    setBadge("humidityStatus", humS); if (humS === "danger") danger = true;

    const seaS =
        c.surface_pressure >= 990 ? "safe" :
        c.surface_pressure >= 970 ? "caution" : "danger";
    setBadge("seaStatus", seaS); if (seaS === "danger") danger = true;

    const seiS = classify(mag, 3.9, 4.9);
    setBadge("seismicStatus", seiS); if (seiS === "danger") danger = true;

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

/* =====================================================
   SECTION 4: NEARBY GOVERNMENT MEDICAL COLLEGES (UPDATED)
===================================================== */

async function fetchNearbySafeLocations(lat, lon) {

    const query = `
        [out:json];
        (
          node["amenity"="hospital"]["operator"~"government|govt|state|central", i]
              (around:5000,${lat},${lon});
          node["amenity"="hospital"]["name"~"Medical College|Govt|Government", i]
              (around:5000,${lat},${lon});
        );
        out body;
    `;

    try {
        const res = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: query
        });

        const data = await res.json();

        if (!data.elements || data.elements.length === 0) {
            document.getElementById("safeLocations").textContent =
                "No nearby government medical colleges found.";
            return;
        }

        const colleges = data.elements
            .slice(0, 3)
            .map(p => p.tags.name || "Government Medical College")
            .join(", ");

        document.getElementById("safeLocations").textContent = colleges;

    } catch (error) {
        document.getElementById("safeLocations").textContent =
            "Unable to fetch government medical colleges.";
        console.error(error);
    }
}

/* =====================================================
   SECTION 5: LOCATION HANDLING (NON-BLOCKING & SAFE)
===================================================== */

const DEFAULT_LAT = 13.08;
const DEFAULT_LON = 80.27;

function initLocationAndLoad() {

    // Always load once with default location
    loadData(DEFAULT_LAT, DEFAULT_LON);
    fetchNearbySafeLocations(DEFAULT_LAT, DEFAULT_LON);

    // Try upgrading to user's real location (optional)
    if (!("geolocation" in navigator)) {
        console.warn("Geolocation not supported. Using default location.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            loadData(lat, lon);
            fetchNearbySafeLocations(lat, lon);
        },
        error => {
            console.warn("Location denied. Continuing with default location.");
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}

/* =====================================================
   SECTION 6: NAVIGATION (UNCHANGED)
===================================================== */

function goToHelp() {
    window.location.href = "need-help.html";
}

function goToVolunteer() {
    window.location.href = "volunteer.html";
}

/* =====================================================
   SECTION 7: APP START
===================================================== */

initLocationAndLoad();
