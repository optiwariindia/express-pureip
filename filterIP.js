function filterIP(xForwardedFor) {
  if (!xForwardedFor || typeof xForwardedFor !== "string") return [];

  const normalizeIP = (ip) => {
    ip = ip.trim();

    // remove brackets: [::1]
    ip = ip.replace(/^\[|\]$/g, "");

    // remove quotes (sometimes proxies send "1.2.3.4")
    ip = ip.replace(/^"|"$/g, "");

    // remove port for ipv4: 1.2.3.4:1234
    if (/^\d+\.\d+\.\d+\.\d+:\d+$/.test(ip)) {
      ip = ip.split(":")[0];
    }

    // ipv4 mapped ipv6: ::ffff:192.168.0.1
    const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
    if (mapped) return mapped[1];

    return ip;
  };

  const isValidIPv4 = (ip) => {
    if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) return false;
    return ip.split(".").every((x) => Number(x) >= 0 && Number(x) <= 255);
  };

  const isValidIPv6 = (ip) => {
    // basic safe validation (not full RFC, but good enough for logs)
    return /^[0-9a-f:]+$/i.test(ip) && ip.includes(":");
  };

  const rawIps = xForwardedFor
    .split(",")
    .map((ip) => normalizeIP(ip))
    .filter(Boolean);

  // keep only valid IPs
  const validIps = rawIps.filter((ip) => isValidIPv4(ip) || isValidIPv6(ip));

  // unique list while preserving order
  return [...new Set(validIps)];
}

module.exports=filterIP;