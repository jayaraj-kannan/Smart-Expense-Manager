import { defineStore } from 'pinia'

interface ReportData {
  title: string;
  date: string;
  amount: string;
  emoji: string;
}
interface MessageData {
  value?: string | { name: string; emoji: string }[];
  emoji?: string;
  reportData?: ReportData[];
  total?: string;
}
interface Message {
  text?: string;
  user: boolean;
  isFocus?: boolean;
  image?: string;
  hasExpense?: boolean;
  hasReport?: boolean;
  data?: Record<string, MessageData>;
}
export const useAppStore = defineStore('app', {
  state: () => ({
    drawer: false, // Global drawer state
    iscontactUsDialogVisible:false,
    messages: [
      { text: 'Hi there!\nHow can I assist you today?', isFocus: true, user: false },
    ] as Message[],
  }),
  actions: {
    setDrawerState(value: boolean) {
      this.drawer = value;
    },
    showDialog() {
      this.iscontactUsDialogVisible = true;
    },
    hideDialog() {
      this.iscontactUsDialogVisible = false;
    },
    toggleDialog() {
      this.iscontactUsDialogVisible = !this.iscontactUsDialogVisible;
    },
    addMessage(message: Message) {
      this.messages.push(message);
    },
    updateMessage(index: number, updatedMessage: Partial<Message>) {
      const targetMessage = this.messages[index];
      if (targetMessage) {
        this.messages[index] = { ...targetMessage, ...updatedMessage };
      }
    },
    getMessages(): Message[] {
      return this.messages;
    },
  },
})
