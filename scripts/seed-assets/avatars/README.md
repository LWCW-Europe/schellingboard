# Seed avatars

Profile pictures used by `scripts/seed-database.ts` for dev/test seed data.

Generated with the [DiceBear](https://www.dicebear.com) HTTP API using the
"Lorelei" style by Lisa Wischofsky, licensed under
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) (public domain,
no attribution required — credited here anyway).

Each file is a 256×256 WebP (~8 KB), matching the size the app itself
produces for uploaded avatars.

To regenerate:

```sh
for i in $(seq -w 1 20); do
  curl -sS -o "avatar-$i.webp" \
    "https://api.dicebear.com/9.x/lorelei/webp?seed=schellingboard-avatar-$i&size=256"
done
```
