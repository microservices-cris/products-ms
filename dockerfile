FROM node:20.14.0-alpine3.20

WORKDIR /usr/src/app

# COPY package.json ./
# COPY package-lock.json ./
COPY package*.json ./

RUN yarn install

# Copy the rest of the files
COPY . .

RUN yarn prisma generate


# Este puerto se expone al exterior, pero no se esta usando internamente porque se esta usando nats para la comunicacion entre microservicios
# Si se quisiera usar este puerto externamente, se deberia cambiar el puerto en el archivo de configuracion docker-compose.yml y exponerlo
EXPOSE 3000