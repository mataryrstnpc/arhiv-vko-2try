#!/bin/sh
# Запуск сайта архива на macOS или Linux: ./start-site.sh
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then
  echo "Нужен Node.js 20.6 или новее: https://nodejs.org"; exit 1
fi
exec node tools/launch.js
