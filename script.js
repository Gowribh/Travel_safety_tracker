function trackLocation() {
  if (!navigator.geolocation) {
    document.getElementById("location").innerText = "Geolocation not supported.";
    return;
  }

  navigator.geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      document.getElementById("location").innerText = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      await fetchLocationName(latitude, longitude);
    },
    (error) => {
      document.getElementById("location").innerText = `Error: ${error.message}`;
    },
    { enableHighAccuracy: true }
  );
}

async function fetchLocationName(lat, lon) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
    const data = await res.json();
    const display = data.display_name || "Unknown area";
    document.getElementById("location-name").innerText = display;
  } catch (e) {
    document.getElementById("location-name").innerText = "Unable to fetch location name";
  }
}

function checkNetwork() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn) {
    updateNetworkStatus(conn);
    conn.addEventListener('change', () => updateNetworkStatus(conn));
  } else {
    document.getElementById("network").innerText = "Not supported";
  }
}

function updateNetworkStatus(conn) {
  const speed = conn.downlink;
  let message = `${conn.effectiveType.toUpperCase()}, ${speed} Mbps – `;

  if (speed >= 5) {
    message += "Excellent connection ✅";
  } else if (speed >= 1) {
    message += "Moderate connection ⚠️";
  } else {
    message += "Weak connection 🔴";
    alert("⚠️ Network is weak! Please stay alert.");
  }

  document.getElementById("network").innerText = message;
}

async function setupBackgroundTask() {
  if ('navigator' in window && 'background' in navigator) {
    try {
      await navigator.background.setTask(() => {
        console.log("Background monitoring running");
        document.getElementById("status").innerText = "Running in background mode...";
      });
    } catch (e) {
      document.getElementById("status").innerText = "Background Tasks not available in your browser";
    }
  } else {
    document.getElementById("status").innerText = "Background Tasks not supported";
  }
}

// Init
trackLocation();
checkNetwork();
setupBackgroundTask();


