---
lang: en-US
title: DMS Niri installer notes
description: My experience with DankLinux
date: 2026-09-28
category:
  - Linux
tag:
  - installation
  - os
  - linux
  - niri
  - dms
---

# DMS Niri

## Key ring

You need a keyring for VSCode and similar

Find the dot folder `.vscode` or `.vscode-oss` and then the file `argv.json`

Then add this

```json
{
  "password-store": "gnome-libsecret"
}
```