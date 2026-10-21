(function () {
  const form = document.getElementById("configForm");
  const errorBox = document.getElementById("formError");
  const historyEl = document.getElementById("history");
  const history = [];

  function showError(message) {
    errorBox.hidden = !message;
    errorBox.textContent = message || "";
  }

  function fillResult(result) {
    document.getElementById("bandwidthValue").textContent = result.bandwidthLabel;
    document.getElementById("timeValue").textContent = result.timeLabel;
    document.getElementById("resSource").textContent = result.source;
    document.getElementById("resDest").textContent = result.destination;
    document.getElementById("resAddress").textContent = result.address;
    document.getElementById("resSize").textContent = result.dataSize.toLocaleString() + " bytes";
  }

  function renderHistory() {
    if (!history.length) {
      historyEl.innerHTML = '<p class="muted">No transfers yet. Run a simulation to log activity on the bus.</p>';
      return;
    }
    historyEl.innerHTML = history.map((tx) => {
      return (
        '<article class="tx">' +
          "<strong>" + tx.source + " \u2192 " + tx.destination + "</strong>" +
          "<p>" + tx.operation + " · " + tx.busWidth + "-bit bus · " +
          tx.transferRate + " million transfers/s</p>" +
          "<p>Data size: " + tx.dataSize.toLocaleString() + " bytes</p>" +
          "<p>Bandwidth: " + tx.bandwidthLabel + " · Time: " + tx.timeLabel + "</p>" +
        "</article>"
      );
    }).join("");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const config = {
      source: document.getElementById("source").value,
      destination: document.getElementById("destination").value,
      operation: document.getElementById("operation").value,
      busWidth: document.getElementById("busWidth").value,
      transferRate: document.getElementById("transferRate").value,
      dataSize: document.getElementById("dataSize").value
    };

    const result = BusSimulator.simulate(config);
    if (!result.ok) {
      showError(result.error);
      return;
    }

    showError("");
    fillResult(result);
    history.unshift(result);
    history.splice(8);
    renderHistory();
  });

  ["source", "destination"].forEach((id) => {
    document.getElementById(id).addEventListener("change", () => {
      const source = document.getElementById("source").value;
      const destination = document.getElementById("destination").value;
      if (source === destination) {
        showError("Source and destination must be different devices.");
      } else {
        showError("");
      }
    });
  });
})();
