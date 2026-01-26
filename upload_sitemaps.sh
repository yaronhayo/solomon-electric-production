#!/bin/bash
cd /Users/yaronhayo/Desktop/solomon-electric
source .deploy/ftp-credentials.env

echo "🗺️  Uploading sitemap files..."

lftp -u "${FTP_USERNAME},${FTP_PASSWORD}" "${FTP_HOST}" <<LFTP_COMMANDS
set ssl:verify-certificate no
set ftp:ssl-allow yes
cd /public_html/
put dist/sitemap-index.xml
put dist/sitemap-0.xml
bye
LFTP_COMMANDS

echo "✅ Sitemap files uploaded!"
