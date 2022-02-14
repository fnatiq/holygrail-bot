# compile ts
FROM node:17 as ts-compiler
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . ./
RUN npm run build

# remove ts junk
FROM node:17 as ts-remover
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app/build ./
RUN npm install --only=production

# for production
FROM node:17
WORKDIR /usr/app
COPY --from=ts-remover /usr/app ./
CMD ["index.js"]
