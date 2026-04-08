FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

# Wait for DB, then migrate, seed, and start
CMD sh -c "npx prisma migrate deploy && npx prisma db seed && npx tsx src/index.ts"
