const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
const app = express();

// Проверка наличия необходимых файлов
console.log("Проверка наличия файлов...");
const files = fs.readdirSync(__dirname);
console.log("Файлы в директории:", files);

if (!files.includes("index.html")) {
    console.error("ОШИБКА: Файл index.html не найден в директории!");
    console.log("Создаю базовый index.html...");
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Форма отправки данных в Firebase</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; }
        form { background-color: #f5f5f5; padding: 20px; border-radius: 8px; }
        label { display: block; margin-bottom: 5px; }
        input[type="text"], input[type="email"] { width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px; }
        input[type="color"] { margin-bottom: 15px; }
        input[type="submit"] { background-color: #4CAF50; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
        input[type="submit"]:hover { background-color: #45a049; }
    </style>
</head>
<body>
    <h1>Отправка данных в Firebase</h1>
    <form action="/submit" method="POST">
        <label for="name">Имя:</label>
        <input type="text" id="name" name="name" required><br><br>

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required><br><br>

        <label for="color">Любимый цвет:</label>
        <input type="color" id="color" name="color"><br><br>

        <input type="submit" value="Отправить">
    </form>
</body>
</html>
    `;
    
    fs.writeFileSync(path.join(__dirname, "index.html"), htmlContent);
    console.log("Файл index.html создан успешно!");
}

// Настройка middleware для обработки тела запроса
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Раздача статических файлов (должно быть до определения маршрутов)
app.use(express.static(__dirname));

// Инициализация Firebase с учетными данными
try {
    if (!files.includes("serviceAccountKey.json")) {
        throw new Error("Файл serviceAccountKey.json не найден");
    }
    
    const serviceAccount = require("./serviceAccountKey.json");
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    
    console.log("Firebase успешно инициализирован");
} catch (error) {
    console.error("Ошибка при инициализации Firebase:", error);
    console.error("Убедитесь, что файл serviceAccountKey.json существует и содержит правильные учетные данные");
    process.exit(1);
}

const db = admin.firestore();

// Маршрут для обработки отправки формы
app.post("/submit", async (req, res) => {
    try {
        console.log("Получены данные формы:", req.body);
        const { name, email, color } = req.body;

        // Проверка наличия обязательных полей
        if (!name || !email) {
            return res.status(400).send("Имя и email являются обязательными полями");
        }

        // Сохранение данных в Firestore
        const docRef = await db.collection("responses").add({
            name,
            email,
            color: color || "#000000",
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log("Документ успешно добавлен с ID:", docRef.id);
        // Отправляем JSON с URL для редиректа
        res.json({ 
            success: true, 
            redirectUrl: `/submit-success?id=${docRef.id}` 
        });
    } catch (error) {
        console.error("Ошибка при записи в Firestore:", error);
        console.error("Stack:", error.stack);
        console.error("Request body:", req.body);
        res.status(500).send(`<pre>${error.message}\n${error.stack}</pre><br>Request body: <pre>${JSON.stringify(req.body, null, 2)}</pre>`);
    }
});

// Страница успешной отправки
app.get("/submit-success", (req, res) => {
    const docId = req.query.id || 'неизвестен';
    res.sendFile(path.join(__dirname, "submit.html"));
});

// Главная страница - этот маршрут должен быть после настройки статических файлов
app.get("/", (req, res) => {
    console.log("Получен запрос на главную страницу");
    res.sendFile(path.join(__dirname, "index.html"));
});

// Обработка ошибок 404
app.use((req, res) => {
    console.log(`404: Запрашиваемый ресурс не найден: ${req.url}`);
    res.status(404).send("Страница не найдена");
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`==========================================================`);
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Откройте браузер и перейдите по адресу: http://localhost:${PORT}`);
    console.log(`==========================================================`);
});
