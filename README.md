# Smart Expense Manager

Smart Expense Manager is a powerful and intuitive web application designed to help you manage your expenses effortlessly. Built with modern technologies like Vue 3 for the frontend and a Node.js server for the backend, it offers a seamless experience for tracking, analyzing, and managing your finances.

---

## 🌟 Features

- **Expense Tracking**: Add, edit, and categorize your expenses.
- **Insightful Analytics**: Visualize your spending patterns with dynamic charts.
- **Responsive Design**: Enjoy a smooth experience on any device.
- **Secure Data Handling**: Ensures your data is safe and secure.
- **Firebase Authentication**: Robust user authentication using Firebase.
- **Real-Time Database**: Leveraging Firebase for real-time updates.
- **Serverless Deployment**: Deployed using Google Cloud Run for scalability and cost-effectiveness.

---

## 🛠️ Technology Stack

### Frontend
- **Vue 3**: A progressive JavaScript framework for building user interfaces.
- **Vuetify 3**: Material Design Component Framework.
- **Axios**: For making API requests.

### Backend
- **Node.js**: A JavaScript runtime for the server-side.
- **Express.js**: Web framework for Node.js.
- **Firebase Admin SDK**: Validation and backend services.

### Database
- **Firebase Firestore**: NoSQL database for storing expense data.

### Deployment
- **Google Cloud Run**: Serverless deployment for scalable and efficient application hosting.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/smart-expense-manager.git
   cd smart-expense-manager
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and configure the following:
   ```env
   PORT=5000
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   FIREBASE_APP_ID=your_firebase_app_id
   FIREBASE_ADMIN_SDK_KEY=your_firebase_admin_sdk_key
   ```

4. **Start the Server**:
   ```bash
   npm run dev
   ```

5. **Start the Frontend**:
   ```bash
   cd client
   npm run serve
   ```

6. **Access the Application**:
   Open your browser and navigate to `http://localhost:8080`.

---

## 📂 Project Structure

```
smart-expense-manager/
├── client/              # Frontend Vue 3 Application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── views/       # Pages and views
│   │   ├── store/       # Vuex store for state management
│   │   └── App.vue      # Root component
│   └── ...
├── server/              # Backend Node.js Application
│   ├── models/          # Data models
│   ├── routes/          # API Routes
│   ├── controllers/     # Request Handlers
│   └── app.js           # Entry point for the server
└── README.md            # Documentation
```

---

## 🖼️ Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Add Expense
![Add Expense](./screenshots/add-expense.png)

---

## 📋 API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register a new user.
- **POST** `/api/auth/login` - Log in with email and password.

### Expenses
- **GET** `/api/expenses` - Retrieve all expenses.
- **POST** `/api/expenses` - Add a new expense.
- **PUT** `/api/expenses/:id` - Update an expense.
- **DELETE** `/api/expenses/:id` - Delete an expense.

---

## 🛡️ Security
- Uses Firebase Authentication for secure user login and registration.
- Backend validation handled using Firebase Admin SDK.
- Ensures safe handling of sensitive data.

---

## 🤝 Contributing

We welcome contributions to improve the Smart Expense Manager. Please follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Commit your changes.
4. Push to your fork.
5. Create a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📞 Support

If you encounter any issues, feel free to open an issue on [GitHub](https://github.com/your-username/smart-expense-manager/issues) or contact us at support@yourdomain.com.

---

## 💡 Acknowledgments

Special thanks to the open-source community and platforms like Firebase and Google Cloud for their robust tools and services.

