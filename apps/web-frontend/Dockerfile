FROM node:20-alpine

WORKDIR /app

# copy only the dependency files to leverage the Docker cache
COPY package*.json ./

RUN npm install

# copy the rest of the code
COPY . .

# expose the Next.js port
EXPOSE 3000

# start in development mode so the changes are seen in real time
CMD ["npm", "run", "dev"]