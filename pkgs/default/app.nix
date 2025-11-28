{ writeShellApplication, cloudflared }:
writeShellApplication {
  name = "tunnel";
  runtimeInputs = [ cloudflared ];
  text = ''
    pnpm run build
    (
      node .output/server/index.mjs &
      cloudflared tunnel run --token "$CLOUDFLARE_TOKEN" &
      wait
    )
  '';
}
