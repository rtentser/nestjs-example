FROM node:20-alpine

WORKDIR /app

# Копируем только файлы зависимостей
COPY package*.json ./

# Устанавливаем всё, включая devDependencies
RUN npm install

# Копируем остальной код (хотя в compose мы его перекроем вольюмом)
COPY . .

# Открываем порт для NestJS и порт для отладки (если нужен)
EXPOSE 3000

# Запускаем в режиме watch
CMD ["npm", "run", "start:dev"]