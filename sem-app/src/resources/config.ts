
function generateRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

interface BannerInfo {
  head: string;
  info: string;
  chip: string[];
  image: string;
}
interface SocialConnectInfo {
  name: string,
  icon: string,
  color: string
}
interface EnvVariable{
  emailjs:{
    serviceId:string,
    templateId:string,
    publcKey:string,
    email:string,
    name:string
  }
}
interface KeyFeature {
  title: string;
  info: string;
  image: string;
  icon: string; // mdi icon
  iconColor: string; // Random color
}
const config: {
  bannerInfo: BannerInfo[];
  keyFeatures: KeyFeature[];
  nodeServerURL: string;
  socialConnect: SocialConnectInfo[];
  profileLink: string;
  envVariables: EnvVariable;
} = {
  envVariables:{
    emailjs: {
      serviceId:import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId:import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      publcKey:import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      name:`Sem APP - Support`,
      email:`jayarajkannan95@gmail.com`
    }
  },
  profileLink: `https://jayaraj-kannan.github.io/my-portfolio/`,
  socialConnect: [
    {
      name: 'https://github.com/jayaraj-kannan',
      icon: 'mdi mdi-github',
      color: '#181717'
    },
    {
      name: 'https://www.linkedin.com/in/jayaraj-kannan-58922b111/',
      icon: 'mdi mdi-linkedin',
      color: '#0077B5'
    },
    {
      name: 'https://www.facebook.com/jrajfx/',
      icon: 'mdi mdi-facebook',
      color: '#1877F2'
    },
    {
      name: 'https://www.instagram.com/jayaraj_creator',
      icon: 'mdi mdi-instagram',
      color: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)'
    },
    {
      name: 'https://twitter.com/jrajfx',
      icon: 'mdi mdi-twitter',
      color: '#1DA1F2'
    }
  ],
  nodeServerURL: import.meta.env.VITE_NODE_BASE_URL,
  bannerInfo: [
    {
      head: `Take control of your finances with Smart Expense Manager! 🤑`,
      info: `Say goodbye to expense management stress and hello to better budgeting and financial peace of mind! <br>
            <strong>📝 Manual Data Entry:</strong> Time-consuming and prone to human error.<br>
            <strong>📜 Paper Receipts:</strong> Easy to misplace and difficult to organize.<br>
            <strong>📊 Lack of Insights:</strong> No real-time analysis or categorization for smarter decision-making.<br>
            <strong>🔗 Fragmented Tools:</strong> Multiple platforms often result in scattered data.`,
      chip: [],
      image: new URL(`../assets/images/money-stress-animate.svg`, import.meta.url).href,
    },
    {
      head: `Manage your expenses smarter with Smart Expense Manager! 🤖`,
      info: `Now featuring a chatbot that saves your expense receipts and SMS details, updates your expense data via chat, and answers your queries with simple prompts.`,
      chip: [
        `📍 How much did I spend on travel?`,
        `💸 I spent for vacation 4000k on last week Sunday.`,
        `📈 What’s my total expense for this month?`,
      ],
      image: new URL(`../assets/images/chat-bot-animate.svg`, import.meta.url).href,
    },
    {
      head: `Discover smarter expense management with Smart Expense Manager! 📊`,
      info: `Get insightful reports, interactive dashboards, and detailed charts to track your spending habits, analyze expenses, and make informed financial decisions.<br>
          Visualize your budget like never before!`,
      chip: [
        `📊 Insights`,
        `📑 Reports`,
        `📉 Dashboards`,
        `📈 Charts`,
        `🗂️ Planning`,
        `⏱️ Tracking`,
      ],
      image: new URL(`../assets/images/design-stats-animate.svg`, import.meta.url).href,
    },
  ],
  keyFeatures: [
    {
      title: `AI-Powered Chatbot`,
      info: `Get personalized assistance from an AI chatbot that helps you manage and track your expenses effortlessly.`,
      image: new URL(`../assets/images/Chat bot-pana.svg`, import.meta.url).href,
      icon: 'mdi-robot', // mdi robot icon
      iconColor: generateRandomColor(), // Random color for icon
    },
    {
      title: `Receipt Bill Scanner`,
      info: `Upload or snap pictures of your receipt bills, and the app will automatically convert them into categorized expense data.`,
      image: new URL(`../assets/images/recipt.png`, import.meta.url).href,
      icon: 'mdi-camera', // mdi camera icon
      iconColor: generateRandomColor(), // Random color for icon
    },
    {
      title: `SMS Expense Capture`,
      info: `Simply copy and paste debit SMS received on your mobile, and the app will convert them into detailed expense entries.`,
      image: new URL(`../assets/images/sms_export.png`, import.meta.url).href,
      icon: 'mdi-message-text', // mdi message-text icon
      iconColor: generateRandomColor(), // Random color for icon
    },
    {
      title: `Expense Tracking by Prompt`,
      info: `Chat your expenses through simple prompts to the app, e.g., "I spent 2000 for shopping at the mall in Chennai yesterday."`,
      image: new URL(`../assets/images/chat_expense.png`, import.meta.url).href,
      icon: 'mdi-chat', // mdi chat icon
      iconColor: generateRandomColor(), // Random color for icon
    },
    {
      title: `Expense Dashboard`,
      info: `View a comprehensive dashboard with interactive charts and visualizations to track expenses by category.`,
      image: new URL(`../assets/images/Visual data-pana.svg`, import.meta.url).href,
      icon: 'mdi-chart-bar', // mdi chart-bar icon
      iconColor: generateRandomColor(), // Random color for icon
    },
    {
      title: `Expense Data Storage`,
      info: `Keep all your expenses securely stored, easily accessible for analysis and budgeting.`,
      image: new URL(`../assets/images/Security On-amico.svg`, import.meta.url).href,
      icon: 'mdi-lock', // mdi lock icon
      iconColor: generateRandomColor(), // Random color for icon
    },
  ],
};

export default config;
