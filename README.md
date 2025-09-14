# Personal Portfolio with Contact Form

A modern, responsive personal portfolio website with a contact form that stores submissions in Firebase Firestore. Features dark/light theme toggle and smooth animations.

## 🚀 Features

- 🌓 Dark/Light theme with system preference detection
- 📱 Fully responsive design
- ✨ Smooth animations and transitions
- 📝 Contact form with form validation
- 🔒 Secure form submission handling
- 📊 Data storage with Firebase Firestore
- ⚡ Optimized performance

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express
- **Database**: Firebase Firestore
- **Styling**: CSS Variables, Flexbox, CSS Grid
- **Build Tool**: npm

## 📦 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account (for database)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Generate a new service account key and save it as `serviceAccountKey.json` in the project root
   - Update Firebase configuration in `server.js`

4. **Environment Variables**
   Create a `.env` file in the root directory with your Firebase configuration:
   ```
   PORT=3000
   ```

5. **Start the development server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
portfolio/
├── public/               # Static files
│   ├── css/             # Compiled CSS
│   ├── img/             # Images
│   └── js/              # Client-side JavaScript
├── src/                 # Source files
│   ├── styles/          # SCSS/CSS source files
│   └── scripts/         # JavaScript modules
├── views/               # HTML templates
├── server.js            # Express server
├── package.json         # Project dependencies
└── README.md            # Project documentation
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
NODE_ENV=development
```

### Firebase Setup

1. Enable Firestore Database in your Firebase Console
2. Update the Firebase configuration in `server.js`
3. Set up appropriate Firestore security rules

## 🛠️ Development

### Available Scripts

- `npm start` - Start the development server
- `npm run dev` - Start with nodemon for development
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com/) for the backend services
- [Google Fonts](https://fonts.google.com/) for typography
- [Font Awesome](https://fontawesome.com/) for icons

---

Made with LOVE by Akadil
