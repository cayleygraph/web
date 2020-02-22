# Build static files using node
FROM node as builder

ADD package.json .
ADD yarn.lock .

RUN yarn

# Copy files relevant to build only
ADD src src
ADD public public
ADD scripts scripts
ADD tsconfig.json tsconfig.json
ADD .eslintrc.json .eslintrc.json

RUN yarn build

# For the acutal serving only nginx is required
FROM nginx

# Copy build results to NGINX HTML directory
COPY --from=builder /build /usr/share/nginx/html
# Copy NGINX configuration
COPY nginx.conf /etc/nginx
# Copy entrypoint script
COPY docker-entrypoint.sh /entrypoint.sh
# Give entrypoint script access permission
RUN chmod 755 /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]

CMD ["nginx"]
