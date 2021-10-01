export default async (): Promise<void> => {
  const { default: localtunnel } = await import("localtunnel");
  const tunnel = await localtunnel({
    port: 3000,
    subdomain: "socialgouvapp3",
  });
  console.log("TUNNEL:", tunnel.url);
  tunnel.on("close", () => {
    // tunnels are closed
  });
};
