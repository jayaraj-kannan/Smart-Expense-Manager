import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from "body-parser";
import { getFirestore, doc, setDoc, collection, getDocs, query } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { EventEmitter } from 'events';
import { fileURLToPath } from 'url';
import { readFileSync } from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccount = JSON.parse(
    readFileSync(new URL("./sem-app-firebase.json", import.meta.url), "utf-8")
  );
EventEmitter.defaultMaxListeners = 20;
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json());
// const allowedOrigins = process.env.ALLOWED_ORIGINS? process.env.ALLOWED_ORIGINS.split(','): [];
// app.use(cors({
//     origin: (origin, callback) => {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     }
// }));

// load environment variables
const port = process.env.PORT || 8080;
const GOOGLE_GEN_AI_KEY = process.env.GOOGLE_GEN_AI_KEY;
const FIRESTORE_API_KEY = process.env.FIRESTORE_API_KEY;
const FIRESTORE_AUTH_DOMAIN = process.env.FIRESTORE_AUTH_DOMAIN;
const FIRESTORE_PROJECT_ID = process.env.FIRESTORE_PROJECT_ID;
const FIRESTORE_STORAGE_BUCKET = process.env.FIRESTORE_STORAGE_BUCKET;
const FIRESTORE_MESSAGING_SENDER_ID = process.env.FIRESTORE_MESSAGING_SENDER_ID;
const FIRESTORE_APP_ID = process.env.FIRESTORE_APP_ID;
const FIRESTORE_MEASUREMENT_ID = process.env.FIRESTORE_MEASUREMENT_ID;
const FIRESTORE_STORAGE_COLLECTION_NAME = process.env.FIRESTORE_STORAGE_COLLECTION_NAME;
console.log("print all ENV variables #START");
console.log("google api key :", GOOGLE_GEN_AI_KEY);
console.log("firebase key :", FIRESTORE_API_KEY);
console.log("firebase domain :", FIRESTORE_AUTH_DOMAIN);
console.log("firebase project :", FIRESTORE_PROJECT_ID);
console.log("firebase bucket :", FIRESTORE_STORAGE_BUCKET);
console.log("firebase messaging :", FIRESTORE_MESSAGING_SENDER_ID);
console.log("firebase app id :", FIRESTORE_APP_ID);
console.log("firebase measurement :", FIRESTORE_MEASUREMENT_ID);
console.log("firebase collect name :", FIRESTORE_STORAGE_COLLECTION_NAME);
console.log("print all ENV variables #END");
// execution promts
// const Q1 = `can you say what is the prompt , response should be any one option ['expense','query','NA'] .conditions : it should be any expense input then return 'expense' or any expense report related question return 'query' else then return 'NA'`;
const Q1 =`give me the single word response about above prompt, response should be any one option [expense,query,NA] as string, 
expense : if the prompt is related to any expense entry or expenses details or expense data or any debit sms.
query : if the prompt is related to any expenses query or expenses question or expenses report or expenses status. 
NA: if the prompt is either 'expense' or 'query'`
const Q2 = `extract data as json, key value should be,
expense :{ 
  title: { value :'give some relevant title', emoji :'relevant emoji'} // Grocery shopping
  amount:{ value :'home much total amount spent',emoji :'relevant emoji'} //example '1500.00'
  date: { value :'get the expense date and use or If the input mentions relative terms (e.g., "today", "yesterday","day before yesterday", "a week ago"), convert them to the corresponding date today date is [CURRENT_DATE] ,Use DD/MM/YYYY format always,.',emoji :'relevant emoji'}  //example '02/01/2024 ,
  tags: { value : [{name :'give  relevant tag',emoji :'relevant emoji'},{name :'give  relevant tag',emoji :'relevant emoji'},{name :'give  relevant tag',emoji :'relevant emoji'}] //example ['vegetables','food','grocery']
  category: { value :'UPI'//example (UPI,DEBIT CARD,CREDIT CARD,CASH),emoji :'relevant emoji'}
}`;
const Q3 = `give me the sum of data as json , 
note : "if my input mentions relative terms (e.g., "this week", "last week","last 7 days", "this month","last month" ,"this year" ), process the data to corresponding date range.for reference today date is [CURRENT_DATE] Use DD/MM/YYYY format always" .
report :{
	title : 'give the result short description with emoji' // here is the details of your expenses spent last week. 
reportData : [
	{ title : 'title of expense', date : 'get the expense date', amount :'amount spent',emoji:'relevant emoji'}, //particular spent details
	{ title : 'title of expense', date : 'get the expense date', amount :'amount spent',emoji:'relevant emoji'}, //particular spent details
	{ title : 'title of expense', date : 'get the expense date', amount :'amount spent',emoji:'relevant emoji'}, //particular spent details
	],// number of reports 
	total : 'total amount spent' // it should be sum of reportData.amount each
}`;
const Q4 = `can give me 3 general expense propmts with relevant emoji, as json array without key, //example how much i spent for this weeek (make it short question)`;
const firebaseConfig = {
    apiKey: FIRESTORE_API_KEY,
    authDomain: FIRESTORE_AUTH_DOMAIN,
    projectId: FIRESTORE_PROJECT_ID,
    storageBucket: FIRESTORE_STORAGE_BUCKET,
    messagingSenderId: FIRESTORE_MESSAGING_SENDER_ID,
    appId: FIRESTORE_APP_ID,
    measurementId: FIRESTORE_MEASUREMENT_ID
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
initializeApp(firebaseConfig);
const fireStoreDb = getFirestore();
const genAI = new GoogleGenerativeAI(GOOGLE_GEN_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
  
    const idToken = authHeader.split('Bearer ')[1];
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log(decodedToken);
      req.user = decodedToken; // Attach decoded token to the request
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log(error);
      return res.status(403).send({ error: 'Forbidden' });
    }
  };

const getUser = async (authHeader) =>{
    try {
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
    } catch (error) {
        
    }
}
app.use(express.static(path.join(__dirname, 'dist')));


// end points
app.get('/api/ping', async (req, res) => {
    res.send('node server is running');
});
app.get('/api/get-expense-count',authenticate, async (req, res) => {
    const username = req.user.email.split('@')[0];
    try {
        const allExpenses = await getAllExpenses(username);
        res.send({ count: allExpenses.length });
    } catch (error) {
        confirm.log("get-expense-count ERROR:",error);
        res.send("api failed");
    }
});
app.get('/api/get-prompt-suggest',authenticate, async (req,res) =>{
    try {
        const result = await chatWithGemini(`${Q4}`);
        const responseData = JSON.parse(result.replaceAll("`", "").replaceAll("json", "").replaceAll("\n", ""));
        console.log(responseData);
        res.send(responseData)
    } catch (error) {
        console.log(error);
        res.send([]);
    }
});
app.get('/api/send-prompt',authenticate, async (req, res) => {
    const username = req.user.email.split('@')[0];
    if (req.query?.prompt) {
        const prompt = req.query.prompt;
        const currentDate = formatDateToDDMMYYYY(new Date());
        try {
            const result = await chatWithGemini(`${prompt} \n ${Q1}`);
            const promptTone = result.trim().toLowerCase().replaceAll('"', '').replaceAll("'", "");
            console.log(promptTone);
            if (promptTone === 'expense') {
                const q2Prompt = Q2.replace('[CURRENT_DATE]', currentDate);
                const dataSet = await chatWithGemini(`${prompt} \n ${q2Prompt}`)
                console.log("dataset :",dataSet);
                const responseData = JSON.parse(dataSet.replaceAll("`", "").replaceAll("json", "").replaceAll("\n", ""));
                await addExpenseData(responseData?.expense,username);
                res.send(responseData);
            } else if (promptTone === 'query') {
                const q3Prompt = Q3.replace('[CURRENT_DATE]', currentDate);
                const allExpense = await getAllExpenses(username);
                console.log()
                const queryResponse = await chatWithGemini(`${JSON.stringify(allExpense)} \n\n ${prompt} \n\n ${q3Prompt}`);
                console.log("queryResponse :",queryResponse);
                const responseData = JSON.parse(queryResponse.replaceAll("`", "").replaceAll("json", "").replaceAll("\n", ""));
                console.log(responseData);
                res.send(responseData);
            } else {
                res.send(result);
            }
        } catch (error) {
            console.log(error);
            res.send("Gemini ai api error, try some other time");
        }

    } else {
        res.send("no prompt recived!")
    }
});
const chatWithGemini = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.log(error);
    }
}

const formatDateToDDMMYYYY = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};
const getAllExpenses = async (username) => {
    try {
        const collectionRef = collection(fireStoreDb, `${username}_${FIRESTORE_STORAGE_COLLECTION_NAME}`);
        const finalData = [];
        const q = query(collectionRef);
        const docSnap = await getDocs(q);
        docSnap.forEach((doc) => {
            finalData.push(doc.data());
        });
        return finalData;
    } catch (error) {
        console.log('Error getall expenses', error);
        return "error";
    }
};
app.get('/api/get-expense',authenticate, async (req, res) => {
    const username = req.user.email.split('@')[0];
    try {
        const finalData = await getAllExpenses(username);
        console.log(finalData.length);
        res.send(finalData);
    } catch (error) {
        console.log("get-expense ERROR :",error);
        res.send("api failed")
    }
});

app.post('/api/upload-recipt',authenticate, async (req, res) => {
    const username = req.user.email.split('@')[0];
    try {
        const { image } = req.body;
        const result = await model.generateContent([
            {
                inlineData: {
                    data: image,
                    mimeType: "image/jpeg",
                },
            },
            `${Q2}`
        ])
            .catch(error => {
                console.log(error);
                res.send("{error : 'add expense failed!'")
            });
        const responseData = JSON.parse(result.response.text().replaceAll("`", "").replaceAll("json", "").replaceAll("\n", ""));
        console.log(responseData);
        await addExpenseData(responseData?.expense, username);
        res.send(responseData);
    } catch (error) {
        console.error("ERROR : ", error);
        res.send("{error : 'add expense failed!'}")
    }

});

const addExpenseData = async (data, username) => {
    try {
        const uniqueId = uuidv4();
        const document = doc(fireStoreDb, `${username}_${FIRESTORE_STORAGE_COLLECTION_NAME}`, uniqueId);
        await setDoc(document, data);
    } catch (error) {
        console.error("ERROR: ", error);
    }
}
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
