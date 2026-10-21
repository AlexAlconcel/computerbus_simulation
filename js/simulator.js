/**
 * Computer bus simulation engine.
 * Bandwidth uses the standard theoretical formula:
 *   bytes per transfer = busWidthBits / 8
 *   bandwidth (MB/s)   = bytes per transfer * transferRate (MT/s)
 *   time (s)           = dataSizeBytes / (bandwidthMB/s * 1e6)
 */
(function (global) {
  const DEVICES = ["CPU", "RAM", "Storage", "I/O"];

  function randomAddress() {
    const n = Math.floor(Math.random() * 0xffff);
    return "0x" + n.toString(16).toUpperCase().padStart(4, "0");
  }

  function bandwidthMBps(busWidthBits, transferRateMTs) {
    const bytesPerTransfer = busWidthBits / 8;
    return bytesPerTransfer * transferRateMTs;
  }

  function transferTimeMs(dataSizeBytes, bandwidthMBpsValue) {
    const seconds = dataSizeBytes / (bandwidthMBpsValue * 1e6);
    return seconds * 1000;
  }

  function formatBandwidth(mbps) {
    return mbps.toFixed(2) + " MB/s";
  }

  function formatTime(ms) {
    if (ms >= 1000) {
      return (ms / 1000).toFixed(5) + " s";
    }
    return ms.toFixed(5) + " ms";
  }

  function validate(config) {
    const source = config.source;
    const destination = config.destination;
    const rate = Number(config.transferRate);
    const size = Number(config.dataSize);
    const width = Number(config.busWidth);

    if (!DEVICES.includes(source) || !DEVICES.includes(destination)) {
      return "Select a valid source and destination device.";
    }
    if (source === destination) {
      return "Source and destination must be different devices.";
    }
    if (!Number.isFinite(rate) || rate <= 0) {
      return "Transfer rate must be a number greater than 0.";
    }
    if (!Number.isInteger(size) || size <= 0) {
      return "Data size must be a whole number of bytes greater than 0.";
    }
    if (![8, 16, 32, 64].includes(width)) {
      return "Bus width must be 8, 16, 32, or 64 bits.";
    }
    return null;
  }

  function simulate(config) {
    const error = validate(config);
    if (error) {
      return { ok: false, error };
    }

    const width = Number(config.busWidth);
    const rate = Number(config.transferRate);
    const size = Number(config.dataSize);
    const mbps = bandwidthMBps(width, rate);
    const timeMs = transferTimeMs(size, mbps);

    return {
      ok: true,
      source: config.source,
      destination: config.destination,
      operation: config.operation,
      busWidth: width,
      transferRate: rate,
      dataSize: size,
      address: randomAddress(),
      bandwidthMBps: mbps,
      bandwidthLabel: formatBandwidth(mbps),
      timeMs,
      timeLabel: formatTime(timeMs),
      timestamp: new Date()
    };
  }

  global.BusSimulator = {
    DEVICES,
    simulate,
    validate
  };
})(window);
