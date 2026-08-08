import { spawn } from "node:child_process";

const isProduction = process.env.VERCEL_ENV === "production";
const hasDatabaseUrl = Boolean(process.env.PRISMA_POSTGRES_DATABASE_URL);

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env: process.env,
      shell: process.platform === "win32",
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      const reason = signal ? `signal ${signal}` : `exit code ${code}`;
      reject(new Error(`${command} ${args.join(" ")} failed with ${reason}`));
    });
  });
}

console.log(`PRISMA_POSTGRES_DATABASE_URL present: ${hasDatabaseUrl ? "yes" : "no"}`);

if (isProduction) {
  if (!hasDatabaseUrl) {
    console.error("PRISMA_POSTGRES_DATABASE_URL is required for production migrations.");
    process.exit(1);
  }

  console.log("Running Prisma production migrations.");
  await run("npx", ["prisma", "migrate", "deploy"]);
} else {
  console.log(`Skipping Prisma migrations for VERCEL_ENV=${process.env.VERCEL_ENV ?? "unset"}.`);
}

console.log("Generating Prisma client.");
await run("npx", ["prisma", "generate"]);

await run("npm", ["run", "build"]);
