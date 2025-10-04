import concurrently from "concurrently";

concurrently([
  {
    name: "Server",
    command: "bun run dev",
    cwd: "packages/server",
    prefixColor: "red",
  },
  {
    name: "Client",
    command: "bun run dev",
    cwd: "packages/client",
    prefixColor: "green",
  },
]);
