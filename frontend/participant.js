const params = new URLSearchParams(window.location.search);
const sessionId = params.get("sessionId");

const sessionData = JSON.parse(localStorage.getItem(sessionId));

let sessionActive = false;
let seconds = 0;
let timerInterval = null;

let exits = 0;
let exitStartTime = null;
let totalInactiveTime = 0;
let logs = [];

if (!sessionData) {
  document.body.innerHTML = "<h2>Session not found.</h2>";
} else {
  document.getElementById("sessionTitle").innerText = sessionData.name;
  document.getElementById("sessionTemplate").innerText = sessionData.template;

  renderFeatures(sessionData.features);

  document.getElementById("startBtn").addEventListener("click", startSession);
  document.getElementById("endBtn").addEventListener("click", endSession);
}

function startSession() {
  sessionActive = true;

  document.getElementById("status").innerText = "Active";
  document.getElementById("startBtn").disabled = true;
  document.getElementById("endBtn").disabled = false;

  timerInterval = setInterval(() => {
    seconds++;

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    document.getElementById("timer").innerText =
      String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
  }, 1000);
}

function endSession() {
  sessionActive = false;
  clearInterval(timerInterval);

  document.getElementById("status").innerText = "Completed";
  document.getElementById("endBtn").disabled = true;

  document.getElementById("summary").classList.remove("hidden");

  document.getElementById("summaryExits").innerText = exits;
  document.getElementById("summaryInactive").innerText = totalInactiveTime;
  document.getElementById("summaryMaxExits").innerText = sessionData.maxExits;

  if (exits > sessionData.maxExits) {
    document.getElementById("policyResult").innerText = "Policy threshold exceeded";
  } else {
    document.getElementById("policyResult").innerText = "Within policy threshold";
  }

  console.log("Final logs:", logs);
}

function renderFeatures(features) {
  const featureBox = document.getElementById("features");
  featureBox.innerHTML = "<h2>Available Features</h2>";

  if (features.includes("timer")) {
    featureBox.innerHTML += "<p>⏱ Timer enabled</p>";
  }

  if (features.includes("quiz")) {
    featureBox.innerHTML += `
      <h3>Quiz/Form</h3>
      <textarea placeholder="Answer here..."></textarea>
    `;
  }

  if (features.includes("notes")) {
    featureBox.innerHTML += `
      <h3>Notes</h3>
      <textarea placeholder="Write notes here..."></textarea>
    `;
  }

  if (features.includes("documents")) {
    featureBox.innerHTML += `
      <h3>Documents</h3>
      <p>Document access enabled.</p>
    `;
  }

  if (features.includes("announcements")) {
    featureBox.innerHTML += `
      <h3>Announcements</h3>
      <p>No announcements yet.</p>
    `;
  }
}

document.addEventListener("visibilitychange", () => {
  if (!sessionActive) return;

  const time = new Date().toISOString();

  if (document.hidden) {
    exitStartTime = Date.now();
    exits++;

    logs.push({
      type: "exit",
      time: time
    });

    document.getElementById("exitCount").innerText = exits;
    document.getElementById("status").innerText = "Inactive";
  } else {
    const exitDuration = exitStartTime
      ? Math.round((Date.now() - exitStartTime) / 1000)
      : 0;

    totalInactiveTime += exitDuration;

    logs.push({
      type: "return",
      time: time,
      exitDurationSeconds: exitDuration
    });

    document.getElementById("status").innerText = "Active";
    console.log("Session logs:", logs);
  }
});