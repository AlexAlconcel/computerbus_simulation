(function () {
  const form = document.getElementById("configForm");
  const errorBox = document.getElementById("formError");
  const historyEl = document.getElementById("history");
  const history = [];

  function showError(message) {
    errorBox.hidden = !message;
    errorBox.textContent = message || "";
  }

  function formatBandwidth(result) {
    return result.bandwidthLabel;
  }

  function formatTimeMilliseconds(result) {
    return result.timeMs.toFixed(5) + " ms";
  }

  function fillResult(result) {
    document.getElementById("bandwidthValue").textContent = formatBandwidth(result);
    document.getElementById("bandwidthSub").textContent = "";
    document.getElementById("timeValue").textContent = formatTimeMilliseconds(result);
    document.getElementById("resSource").textContent = result.source;
    document.getElementById("resDest").textContent = result.destination;
    document.getElementById("resAddress").textContent = result.address;
    document.getElementById("resSize").textContent = result.dataSize.toLocaleString() + " bytes";
  }

  function renderHistory() {
    if (!history.length) {
      historyEl.innerHTML = '<p class="empty">No transfers yet. Run a simulation to log activity on the bus.</p>';
      return;
    }
    const rows = history.map((tx) => (
      "<tr><td>◷ &nbsp;" + tx.timestamp.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) + " " + tx.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) +
      "</td><td>" + tx.source + "</td><td>" + tx.destination + "</td><td>" + tx.operation + "</td><td>" + tx.busWidth + " bits</td><td>" +
      tx.dataSize.toLocaleString() + " bytes</td><td>" + tx.transferRate + " MT/s</td><td>" + formatTimeMilliseconds(tx) + "</td><td>" + formatBandwidth(tx) +
      "</td></tr>"
    )).join("");
    historyEl.innerHTML = '<table><thead><tr><th>Date &amp; Time</th><th>Source</th><th>Destination</th><th>Operation</th><th>Bus Width</th><th>Data Size</th><th>Transfer Rate</th><th>Estimated Time</th><th>Bandwidth</th></tr></thead><tbody>' + rows + "</tbody></table>";
  }

  form.addEventListener("submit", function (event) {
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

  ["source", "destination"].forEach(function (id) {
    document.getElementById(id).addEventListener("change", function () {
      const source = document.getElementById("source").value;
      const destination = document.getElementById("destination").value;
      showError(source === destination ? "Source and destination must be different devices." : "");
    });
  });
}());
