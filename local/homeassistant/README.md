# Home Assistant — deploy & onboarding

MVP dashboard that replaces the gethomepage dashboard, deployed by
`docker/homeassistant.yml`. Runs at `https://homeassistant.<DOMAIN>`.

## What the playbook does (fully automated / git-managed)

- Copies `configuration.yaml` (YAML-mode Lovelace + REST sensors).
- Templates `ui-lovelace.yaml` (the dashboard) and `secrets.yaml`. The `arr_apikeys` role
  (`roles/arr_apikeys/`, shared with `docker/homepage.yml`) extracts the Prowlarr/Bazarr keys
  straight from those services' own config files; the Tdarr key comes from `vars/vault.yml`.
- Starts the container on the `proxy` network with a `/storage` NAS mount.
- **Auth:** uses `traefik_public_labels` (no Authelia middleware) — HA owns its own login,
  so the companion app and API keep working.
- **Live without any manual step:** Prowlarr (indexer count) and Bazarr (wanted subtitles),
  defined as declarative REST sensors in `configuration.yaml`.

## ⚠️ One-time manual onboarding (NOT reproducible by this playbook)

The rich integrations below are **config-flow only** — Home Assistant stores their setup in
`/config/.storage`, which is *not* git-managed and *not* recreated by re-running the playbook.
**On a fresh install (new box, or wiped `/config`) you must redo these steps by hand:**

1. Browse to `https://homeassistant.<DOMAIN>` and **create the owner account** (first run only —
   HA's onboarding wizard cannot be automated).
2. **Settings → Devices & Services → Add Integration**, once per service:

   | Integration    | URL / host             | Credential            |
   |----------------|------------------------|-----------------------|
   | Sonarr         | `http://vpn:8989`      | API key               |
   | Radarr         | `http://vpn:7878`      | API key               |
   | Lidarr         | `http://vpn:8686`      | API key               |
   | Jellyfin       | `http://jellyfin:8096` | username / password   |
   | System Monitor | —                      | enable CPU %, Memory %, Disk usage for `/` and `/storage` |
   | Weather        | —                      | Met.no (free, no key) |

   > *arr / Jellyfin API keys are found in each service's own **Settings → General → Security**.

3. On the *arr integrations, **enable the default-disabled sensors** (Queue, Wanted, Disk space) —
   HA ships them disabled.
4. If any System Monitor entity gets an auto-suffixed id (e.g. `sensor.system_monitor_disk_usage_2`),
   update the matching id in `ui-lovelace.yaml`. Dashboard cards for not-yet-added integrations show
   "Entity not available" until onboarding is done — this is expected, not an error.

## No manual step needed

- **Prowlarr, Bazarr** — live via git-managed REST sensors.
- **Ombi** — YAML-only integration configured in `configuration.yaml`. Requires `ombi_username` in
  `vars/vault.yml` (alongside `ombi_apikey`).
- **Tdarr, Calibre, Calibre-Web** — link tiles only (Tdarr's stats API is a POST/`cruddb` shape not
  wired for the MVP; Calibre has nothing worth polling — same treatment as the old homepage dashboard).

## Deploy

```bash
ansible-playbook -Kk docker/homeassistant.yml
```

The playbook prints an abbreviated version of the onboarding checklist at the end of every run.
