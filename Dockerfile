# STAGE 1: building the angular application 
FROM node:14.19-alpine as builder

WORKDIR /app

COPY / ./
 
COPY package*.json ./

RUN npm install && npm run build


# STAGE 2 run on nginx web server
FROM nginx:1.20.2-alpine as dist

EXPOSE 80

COPY --from=builder /app/dist/foncier-portal /usr/share/nginx/html
COPY --from=builder /app/nginx.conf etc/nginx/conf.d/default.conf

CMD ["/bin/sh", "-c", "\
sed -i s#KEYCLOAK_URL#$KEYCLOAK_URL#g /usr/share/nginx/html/main.*.js &&\
sed -i s#KEYCLOAK_REALM#$KEYCLOAK_REALM#g /usr/share/nginx/html/main.*.js &&\
sed -i s#KEYCLOAK_CLIENT_ID#$KEYCLOAK_CLIENT_ID#g /usr/share/nginx/html/main.*.js &&\
sed -i s#API_URL#$API_URL#g /usr/share/nginx/html/main.*.js &&\
sed -i s#API_VERSION#$API_VERSION#g /usr/share/nginx/html/main.*.js &&\
sed -i s#GEOPORTAL_APP_URL#$GEOPORTAL_APP_URL#g /usr/share/nginx/html/main.*.js &&\
sed -i s#GEOPORTAL_PRO_APP_URL#$GEOPORTAL_PRO_APP_URL#g /usr/share/nginx/html/main.*.js &&\
sed -i s#GEOPORTAL_OVERVIEW#$GEOPORTAL_OVERVIEW#g /usr/share/nginx/html/main.*.js &&\
sed -i s#CAMUNDA_URL#$CAMUNDA_URL#g /usr/share/nginx/html/main.*.js &&\
nginx -g 'daemon off;'"]

