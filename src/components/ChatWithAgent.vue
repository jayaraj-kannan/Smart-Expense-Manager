<template>
  <v-app>
    <v-main>
      <v-container fluid class="chat-container">
        <!-- Chat Messages Section -->
        <v-card class="chat-box" flat>
          <v-card class="pr-10 pl-10">
            <div v-for="(message, index) in messages" :key="index" class="message-row"
              :class="{ 'user-message': message.user }">
              <v-avatar v-if="!message.user" class="bot-avatar">
                <v-icon>mdi-robot</v-icon>
              </v-avatar>
              <div class="message-content">
                <div class="message-text">{{ message.text }}</div>
              </div>
            </div>

          </v-card>

        </v-card>

        <!-- Input Section -->
        <v-row class="input-section" align="center" justify="center">
          <v-col cols="8">
            <v-text-field v-model="input" rounded="pill" variant="solo-filled" flat hide-details
              placeholder="Type a message..." @keydown.enter="sendMessage"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-btn icon color="primary" @click="sendMessage">
              <v-icon>mdi-send</v-icon>
            </v-btn>
            <v-btn icon class="ml-2" color="primary" @click="selectFile">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <input type="file" ref="importRecipt" style="display: none"
                                        @change="onFileSelected" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';
interface Message {
  text: string;
  user: boolean;
}

// Reactive data properties
const input = ref('');
const messages = ref<Message[]>([
  { text: 'Hi there! How can I assist you today?', user: false },
  { text: 'Can you tell me about Vue.js?', user: true },
]);
const importRecipt = ref<HTMLInputElement | null>(null);
const selectFile = () => {
  importRecipt.value?.click();
};
const onFileSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input?.files?.[0];

  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const base64Image = (reader.result as string).split(',')[1]; // Extract Base64 data
      const response = await axios.post('http://localhost:3030/analyze-receipt', {
        image: base64Image,
      });
      console.log("recipt response: ",response);
    } catch (error) {
      console.error('Error analyzing receipt:', error);
    }
  };

  reader.readAsDataURL(file);
};
// Methods
const sendMessage = () => {
  if (input.value.trim()) {
    messages.value.push({ text: input.value, user: true });
    input.value = '';

    // Simulate bot response
    setTimeout(() => {
      messages.value.push({ text: 'Vue.js is a progressive JavaScript framework!', user: false });
    }, 1000);
  }
};
const uploadRecipt = () => {
  //upload recipt as image format
}
</script>

<style scoped>
.chat-container {
  height: calc(100vh - 64px);
  /* Adjust based on your header height */
  overflow-y: auto;
  padding-bottom: 80px;
  /* Space for input field */
}

.chat-box {
  max-height: 100%;
  overflow-y: auto;
}

.input-section {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: white;
  padding: 10px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}

.message-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-message {
  justify-content: flex-end;
}

.user-message .message-content {
  background-color: #e0f7fa;
  border-radius: 10px;
  padding: 10px;
}

.bot-message {
  justify-content: flex-start;
}

.bot-avatar {
  margin-right: 10px;
}

.message-content {
  max-width: 70%;
}

.message-text {
  word-wrap: break-word;
}
</style>