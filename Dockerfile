FROM node:16.16.0

WORKDIR /app

# ENV PORT 8080
# ENV HOST 0.0.0.0

COPY package*.json ./
RUN npm install 
COPY . .
CMD npm start



# 1st => $ docker build ./ -t app
# 2nd => $ docker run -p 3000:3000 app

