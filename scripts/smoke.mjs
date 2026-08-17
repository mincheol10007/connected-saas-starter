const argument = process.argv.find((value) => value.startsWith("--base-url="));
const baseUrl = (argument?.split("=")[1] ?? process.env.SMOKE_BASE_URL ?? "").replace(/\/$/, "");

if (!baseUrl) {
  console.error("Usage: npm run smoke -- --base-url=https://example.vercel.app");
  process.exit(1);
}

const checks = [
  { path: "/", expected: 200 },
  { path: "/api/health", expected: 200 },
  { path: "/dashboard", expected: 200, finalPath: "/login" },
];

let failed = false;

for (const check of checks) {
  const response = await fetch(`${baseUrl}${check.path}`, { redirect: "follow" });
  const finalPath = new URL(response.url).pathname;
  const passed = response.status === check.expected && (!check.finalPath || finalPath === check.finalPath);
  console.log(`${passed ? "PASS" : "FAIL"} ${check.path} -> ${response.status} ${finalPath}`);
  failed ||= !passed;
}

process.exit(failed ? 1 : 0);
