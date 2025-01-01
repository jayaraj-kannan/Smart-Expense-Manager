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
   git clone https://github.com/jayaraj-kannan/Smart-Expense-Manager.git
   cd smart-expense-manager
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   cd sem-app
   npm install
   cd ..
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and configure the following:
   - `.env` for node server

   ```env
   PORT=8080
   GOOGLE_GEN_AI_KEY=your_gemini_ai_api_key
   FIRESTORE_API_KEY=your_firebase_api_key
   FIRESTORE_AUTH_DOMAIN=your_firebase_auth_domain
   FIRESTORE_PROJECT_ID=your_firebase_project_id
   FIRESTORE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIRESTORE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   FIRESTORE_APP_ID=your_firebase_app_id
   FIRESTORE_MEASUREMENT_ID=your_firebase_measurement_id
   FIRESTORE_STORAGE_COLLECTION_NAME=your_collection_name
   ```
   - `.env` for font end (sem-app)

   ```bash
   cd sem-app
   ```

   ```env
   VITE_FIRESTORE_API_KEY=your_firebase_api_key
   VITE_FIRESTORE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIRESTORE_PROJECT_ID=your_firebase_project_id
   VITE_FIRESTORE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIRESTORE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIRESTORE_APP_ID=your_firebase_app_id
   VITE_FIRESTORE_MEASUREMENT_ID=your_firebase_measurement_id
   VITE_EMAILJS_SERVICE_ID=your_emaijs_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_emaijs_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_emaijs_public_key
   ```

   ```bash
   cd ..
   ```

3. **Set Up Environment Variables**:
  - download and place firebase service account .json file on root directory

4. **Start the Server**:
   ```bash
   npm run start
   ```

5. **Start the Frontend**:
   ```bash
   cd sem-app
   npm run build
   ```

6. **Access the Application**:
   Open your browser and navigate to `http://localhost:8080`.

---

## 🖼️ Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Add Expense
![Add Expense](./screenshots/add-expense.png)

---

## 🛡️ Security
- Uses Firebase Authentication for secure user login and registration.
- Backend validation handled using Firebase Admin SDK.
- Ensures safe handling of sensitive data.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📞 Support

If you encounter any issues, feel free to open an issue on [GitHub](https://github.com/jayaraj-kannan/Smart-Expense-Manager.git) or contact us at jrajfx@gmail.com.

---

## 💡 Acknowledgments

Special thanks to the open-source community and platforms like Firebase and Google Cloud for their robust tools and services.

