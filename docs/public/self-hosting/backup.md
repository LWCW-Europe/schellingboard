---
title: "Backup and restore"
description: "Back up a running SchellingBoard instance and restore it again."
type: guide
---

# Backup and restore

Everything SchellingBoard stores lives in one Docker volume, mounted at
`/data`: the database (`/data/data.db`) and any files uploaded through the
admin UI, such as guest avatars and the venue map (`/data/uploads`).

Your `.env` is **not** in that volume. Back it up separately — it holds
`AUTH_SECRET`, `SITE_PASSWORD`, `ADMIN_PASSWORD` and your SMTP credentials,
and restoring the data without the same `AUTH_SECRET` logs everyone out.

## Find the volume

The examples below use `$VOL` for the volume name. With `docker compose` it is
your project directory plus `_data`; with the plain `docker run` command from
[Deployment](deployment.md) it is `schellingboard_data`.

```bash
docker volume ls | grep data
VOL=schellingboard_data
```

## Back up without stopping the site

Don't copy `data.db` with `cp` or `tar` while the site is running — a write in
progress leaves you with a truncated file that looks fine until you try to
restore it. Use SQLite's own backup command, which takes a consistent snapshot
of a database that is being written to:

```bash
mkdir -p ./backups
STAMP=$(date +%Y%m%d-%H%M%S)

docker run --rm \
  -v "$VOL:/data" \
  -v "$PWD/backups:/backup" \
  alpine sh -c "apk add --no-cache sqlite >/dev/null && \
    sqlite3 /data/data.db \".backup '/backup/data-$STAMP.db'\" && \
    tar czf /backup/uploads-$STAMP.tar.gz -C /data uploads"
```

This leaves `backups/data-<stamp>.db` and `backups/uploads-<stamp>.tar.gz` on
the host. It runs against the live volume, so no downtime and no dropped
requests.

Run it from `cron` to get regular backups, and copy the results somewhere off
the machine — a backup that only exists on the server it came from does not
survive losing the server.

## Back up with the site stopped

If a few seconds of downtime is fine, stopping the app first means a plain
archive of the whole volume is safe, and there is nothing to keep in sync:

```bash
docker compose stop app
docker run --rm -v "$VOL:/data:ro" -v "$PWD/backups:/backup" \
  alpine tar czf "/backup/volume-$STAMP.tar.gz" -C /data .
docker compose start app
```

## Restore

Stop the app, put the files back, and start it again:

```bash
docker compose stop app

docker run --rm -v "$VOL:/data" -v "$PWD/backups:/backup" alpine sh -c "
  rm -rf /data/data.db /data/data.db-wal /data/data.db-shm /data/uploads &&
  cp /backup/data-$STAMP.db /data/data.db &&
  tar xzf /backup/uploads-$STAMP.tar.gz -C /data &&
  chown -R 1001:1001 /data"

docker compose start app
```

The `chown` matters: SchellingBoard runs as user `1001` inside the container,
but the helper above writes as `root`, so without it the app cannot open its
own database.

Restoring into a **newer** version of SchellingBoard works — it migrates the
database on startup. Restoring into an **older** one does not, so pin
`SCHELLINGBOARD_VERSION` to the version the backup came from if you are
rolling back.

Check the restore afterwards by opening the site: the events, proposals and
sessions should be there, and the venue map and guest avatars should load.
