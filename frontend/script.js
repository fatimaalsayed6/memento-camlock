document.getElementById("sessionForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const selectedFeatures = [];
  document.querySelectorAll("fieldset input:checked").forEach((checkbox) => {
    selectedFeatures.push(checkbox.value);
  });

  const sessionId = "S" + Date.now();

  const sessionData = {
    id: sessionId,
    name: document.getElementById("sessionName").value,
    template: document.getElementById("template").value,
    duration: Number(document.getElementById("duration").value),
    maxExits: Number(document.getElementById("maxExits").value),
    theme: document.getElementById("theme").value,
    features: selectedFeatures
  };

  localStorage.setItem(sessionId, JSON.stringify(sessionData));

  const link = `participant.html?sessionId=${sessionId}`;

  document.getElementById("result").classList.remove("hidden");
  document.getElementById("sessionLink").innerText = link;

  console.log("Generated session:", sessionData);
});