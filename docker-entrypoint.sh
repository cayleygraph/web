#!/bin/bash
set -e;

HTML_FILE="/usr/share/nginx/html/index.html";
SERVER_URL_PLACEHOLDER="__SERVER_URL__";

# If SERVER_URL environment variable is provided set it instead of the
# placeholder in the HTML file
if [ -n "$SERVER_URL" ]
then
    QUOTED_SERVER_URL=\"$SERVER_URL\";
    sed -i "s~$SERVER_URL_PLACEHOLDER~$QUOTED_SERVER_URL~" "$HTML_FILE";
    # Log to stderr
    >&2 echo "SERVER_URL is set to: $QUOTED_SERVER_URL";
fi

# Execute CMD
exec "$@";