const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
const app = express();

const files = fs.readdirSync(__dirname);

if (!files.includes("index.html")) {
    const htmlContent = `<!DOCTYPE html>
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
</html>`;
    
    fs.writeFileSync(path.join(__dirname, "index.html"), htmlContent);
}

// Configure body parser to handle JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
// Serve root files (like index.html)
app.use(express.static(__dirname));

// Log all requests for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Serve favicon.ico
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// Test endpoint
app.get('/test', (req, res) => {
    res.send('Server is running!');
});

try {
    if (!files.includes("serviceAccountKey.json")) {
        throw new Error("Файл serviceAccountKey.json не найден");
    }
    
    const serviceAccount = require("./serviceAccountKey.json");
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} catch (error) {
    console.error("Ошибка при инициализации Firebase:", error);
    process.exit(1);
}

const db = admin.firestore();

app.post("/submit", async (req, res) => {
    try {
        console.log('Received submission:', req.body);
        
        const { name, email, color } = req.body;

        if (!name || !email) {
            console.log('Validation failed: name or email missing');
            return res.status(400).json({ 
                success: false, 
                message: "Name and email are required fields" 
            });
        }

        const docRef = await db.collection("responses").add({
            name: name.trim(),
            email: email.trim(),
            color: (color || "#000000").trim(),
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log('Form data saved with ID:', docRef.id);
        
        res.json({ 
            success: true, 
            redirectUrl: `/submit-success?id=${docRef.id}`,
            message: "Form submitted successfully"
        });
    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'An error occurred while processing your request'
        });
    }
});

app.get("/submit-success", (req, res) => {
    res.sendFile(path.join(__dirname, "submit.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.use((req, res) => {
    res.status(404).send("Страница не найдена");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
