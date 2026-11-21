const keys = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "MONGODB_URI",
];
for (const k of keys) console.log(k.padEnd(22), process.env[k] ? "OK" : "MISSING");