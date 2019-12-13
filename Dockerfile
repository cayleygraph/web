# Build static files using node
FROM node as builder

ADD package.json .
ADD yarn.lock .

RUN yarn

ADD . .

RUN yarn build

# For the acutal serving only nginx is required
FROM nginx

COPY --from=builder /build /usr/share/nginx/html
COPY nginx.conf /etc/nginx

# Use first argument (can be omitted as SERVER_URL)
# __SERVER_URL__ is replaced in runtime with first argument
CMD ["bash", "-c", 'sed -i "/usr/share/nginx/html/index.html" "s/__SERVER_URL__/\"$1\"/" && nginx']
