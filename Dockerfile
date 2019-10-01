FROM node as builder

ADD package.json .
ADD yarn.lock .

RUN yarn

ADD . .

RUN yarn build

FROM nginx
COPY --from=builder /build /usr/share/nginx/html
COPY nginx.conf /etc/nginx
CMD nginx