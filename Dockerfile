FROM node:16.15-alpine3.16 as build-deps
WORKDIR /usr/src/app

ENV NODE_OPTIONS --max_old_space_size=4096

COPY / .
RUN set NODE_OPTIONS=--max_old_space_size=4096 && \
    yarn install && \
    yarn build

FROM nginx:1.21-alpine

ENV TZ=America/Sao_Paulo
RUN apt-get update \
    && apt-get install -yq tzdata locales -y \
    && dpkg-reconfigure --frontend noninteractive tzdata \
	  && locale-gen en_US.UTF-8

COPY configuracoes/default.conf /etc/nginx/conf.d/
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html

COPY docker/startup.sh /

RUN ["chmod", "+x", "/startup.sh"]

EXPOSE 80
ENTRYPOINT ["/startup.sh"]
