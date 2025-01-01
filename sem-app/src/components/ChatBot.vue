<template>
  <v-app>
    <v-main class="justify-center align-center" :class="{ 'd-flex': isStartingChat }">
      <v-sheet v-if="!isStartingChat" class="mx-auto">

        <v-responsive class="pt-2 pl-5 pr-5" :class="customClass">

          <div v-for="(message, index) in messages" :key="index" class="message-row"
            :class="{ 'user-message': message.user }">
            <v-avatar v-if="!message.user" class="bot-avatar">
              <v-icon>mdi-face-agent</v-icon>
            </v-avatar>
            <div class="rounded-xl text-body-2" :class="{ 'message-user': message.user }">
              <div v-if="message.text" :class="{'focusable': message.isFocus}" :tabindex="message.isFocus ? 0 : -1"
                class="message-text pb-1" v-html="message.text"></div>
              <div v-if="message.text && message.hasExpense" class="message-text">
                <div v-for="(data, key) in message.data" :key="key" class="message-item">
                  <div>
                    <strong>{{ key }}: </strong>
                    <template v-if="Array.isArray(data.value)">
                      <span v-for="(item, index) in data.value" :key="index">
                        {{ item.emoji }} {{ item.name }}
                        <span v-if="index < data.value.length - 1">, </span>
                      </span>
                    </template>
                    <template v-else>
                      {{ data.emoji }} {{ data.value }}
                    </template>
                  </div>
                </div>
              </div>
              <div v-if="message.text && message.hasReport" class="message-text">
                <div v-for="(data, key) in message?.data" :key="key" class="message-item">
                  <!-- Loop through reportData for each data object -->
                  <div v-for="(item, idx) in data.reportData" :key="idx" class="report-item">
                    <strong>{{ idx + 1 }}</strong> - {{ item.emoji }} {{ item.title }} ({{ item.date }}) - 💵 {{
                      item.amount }}
                  </div>

                  <!-- Display total if it exists for the current data -->
                  <div v-if="data.total" class="message-total">
                    <strong>Total:</strong> 💵 {{ data.total }}
                  </div>
                </div>
              </div>
              <v-img v-if="message.image" :src="message.image" :width="100" aspect-ratio="1/1"
                alt="User uploaded image">
              </v-img>
            </div>
          </div>
          <div v-if="isBotTyping" class="message-row">
            <v-avatar class="bot-avatar">
              <v-icon>mdi-face-agent</v-icon>
            </v-avatar>
            <div>
              <div class="loading-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </v-responsive>

      </v-sheet>

      <div class="pa-2 pr-10 pl-10  mx-auto" height="30px" :class="{ 'chat-input': isStartingChat }">
        <v-textarea v-model="input" rounded="xl" variant="solo-filled" flat :rows="textareaRowCount" hide-details
          class="flex-grow-1 textarea-input" no-resize placeholder="ask something ..." @keydown.enter="handleKeydown">
          <template #append-inner>
            <div>
              <v-btn v-if="isSubmitPrompt" :loading="loadingSubmit" icon size="35" class="ml-2" color="#616161" @click="submitPrompt">
                <v-icon size="20">mdi mdi-chevron-right</v-icon>
              </v-btn>
              <v-menu v-else v-model="attachedMenu" :close-on-content-click="false" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn :loading="loadingSubmit" icon size="35" v-bind="props" class="ml-2" color="#616161">
                    <v-icon size="20" style="transform: rotate(45deg)">mdi mdi-paperclip</v-icon>
                  </v-btn>
                </template>

                <v-card min-width="150" variant="flat" class="rounded-lg">
                  <v-list>
                    <v-list-item class="pl-5" @click="selectFile">
                      <template #prepend>
                        <v-icon>mdi mdi-file-document-plus</v-icon>
                        <span class="pl-2"> upload image </span>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </div>
          </template>
        </v-textarea>
        <input type="file" ref="importRecipt" style="display: none" @change="onFileSelected" />
        
        <div v-if="showSuggest">
          <v-chip v-for="(prompt, index) in suggest" :key="index" size="small" class="mr-2 mt-1" @click="onSuggestionClick(prompt)">{{ prompt }}</v-chip>
        </div>
      </div>
      <div>
      </div>
      <v-dialog v-model="cropDialog" max-width="600">
        <template v-slot:default>
          <v-card>
            <v-card-title class="headline">Crop Image</v-card-title>
            <v-card-text>
              <div ref="cropperContainer" style="width: 100%; height: 400px;">
                <img ref="selectedImageRef" :src="selectedImageSrc" alt="To crop" style="max-width: 100%;" />
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="closeDialog">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="cropImage">Crop</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-dialog v-model="croppedDialog" max-width="400">
        <template v-slot:default>
          <v-card>
            <v-card-title class="headline">Cropped Image</v-card-title>
            <v-card-text>
              <div class="image-container">
                <img :src="croppedImage" alt="Cropped" class="cropped-image" />
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="submitImage">Upload</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-dialog v-model="startDialog" width="600">
      <v-card class="mx-auto rounded-xl pa-4">
        <v-card-title >Get Started!</v-card-title>
        <v-card variant="flat" class="mx-auto rounded-xl" color="#f5f3ef">

          <v-card-text class="d-flex justify-center align-center">📸 Snap or upload your expense receipts, and by prompt, you can quickly update your expenses. Let's keep track and stay organized! 💰💡</v-card-text>
        </v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn size="small" variant="flat" class="rounded-lg mx-auto gradient-btn" color="#87f4b5" @click="startDialog = false">get started</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, nextTick, watch, onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import { getCurrentUser } from '../services/authService';
import { useAppStore } from '../stores/app';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import router from '../router';
import axiosInstance from '../plugins/axios';
const appStore = useAppStore();
const display = useDisplay();
const customClass = ref('content-container-md');
customClass.value = display.mobile.value ? "content-container-sm" : "content-container-md";
const input = ref('');
const showSuggest = ref(false);
const currentUser = ref();
const suggest = ref();
const attachedMenu = ref(false);
const startDialog = ref(false);
const isActiveDrawer = ref(appStore.drawer);
const cropDialog = ref(false);
const croppedDialog = ref(false);
const isSubmitPrompt = ref(false);
const selectedImageSrc = ref<string>();
const croppedImage = ref<string>();
const selectedImageRef = ref<HTMLImageElement | null>(null);
let cropper: Cropper | null = null;
const loadingSubmit = ref(false);
watch(
  () => appStore.drawer,
  (newVal) => {
    isActiveDrawer.value = newVal;
  }
);
watch(
  [input, loadingSubmit],
  ([newInputValue, newLoadingSubmitValue]) => {
    isSubmitPrompt.value = newInputValue.length > 0 || newLoadingSubmitValue;
  }
);
const isSmallDevice = () => {
  return !display.platform.value.android && !display.platform.value.ios
};
const formattedText = (value: string) => {
  if (!value) return '';
  return value.replace(/\n/g, '<br>');
};
const isuserHasExpenses = async () => {
  try { 
    await axiosInstance.get(`/api/get-expense-count`)
    .then(result =>{
    if( !(result.data.count > 0 )){
      startDialog.value = true;
    }
    }).catch(error =>{
      console.log(error);
    })
  } catch (error) {
    console.log(error);
  }
}

const textareaRowCount = ref(3);
const isBotTyping = ref(false);
const isStartingChat = ref(false);
const messages = ref(appStore.getMessages());

const importRecipt = ref<HTMLInputElement | null>(null);
const scrollContainer = ref<HTMLElement | null>(null);
const initCropper = () => {
  if (selectedImageRef.value) {
    if (cropper) {
      cropper.destroy();
    }
    cropper = new Cropper(selectedImageRef.value, {
      aspectRatio: NaN,
      viewMode: 1,
    });
  }
};
const onSuggestionClick = (prompt:string) =>{
  showSuggest.value = false;
  input.value = prompt;
  submitPrompt();
};
const cropImage = () => {
  if (cropper) {
    const canvas = cropper.getCroppedCanvas();
    croppedImage.value = canvas.toDataURL('image/jpeg');
    cropDialog.value = false;
    canvas.toBlob(
      (blob) => {
        if (blob) {
          // Compress further if the size is above 20KB
          if (blob.size > 20000) {
            const reader = new FileReader();
            reader.onload = () => {
              const compressedCanvas = document.createElement("canvas");
              const ctx = compressedCanvas.getContext("2d");
              const img = new Image();
              img.onload = () => {
                // Resize to lower dimensions or compress further
                const ratio = Math.sqrt(20000 / blob.size); // Calculate a compression ratio
                compressedCanvas.width = img.width * ratio;
                compressedCanvas.height = img.height * ratio;
                ctx?.drawImage(img, 0, 0, compressedCanvas.width, compressedCanvas.height);

                // Convert compressed canvas to Data URL
                croppedImage.value = compressedCanvas.toDataURL("image/jpeg", 0.8); // 80% quality
                croppedDialog.value = true;
              };
              img.src = reader.result as string;
            };
            reader.readAsDataURL(blob);
          } else {
            // If size is already below 20KB, store directly
            const reader = new FileReader();
            reader.onload = () => {
              croppedImage.value = reader.result as string;
              croppedDialog.value = true;
            };
            reader.readAsDataURL(blob);
          }
        }
      },
      "image/jpeg", // Use JPEG for better compression
      0.8 // 80% quality (adjust to balance quality vs size)
    );
    cropper.destroy();
    cropper = null;
    croppedDialog.value = true;
  }
};
const submitImage = async () => {
  isStartingChat.value = false;
  textareaRowCount.value = 2;
  isBotTyping.value = true;
  attachedMenu.value = false;
  messages.value.push({ image: croppedImage.value, user: true });
  croppedDialog.value = false;
  try {
    if (!croppedImage.value) {
      throw new Error("No image to upload");
    }
    const base64Image = croppedImage.value.split(',')[1];
    const response = await axiosInstance.post(`/api/upload-recipt`, {
      image: base64Image,
    });
    messages.value.push({
      text: "Your expense details are updated :",
      user: false,
      hasExpense: true,
      data: response.data?.expense,
    });
    isBotTyping.value = false;
    scrollToBottom();
  } catch (error) {
    // Handle error
    messages.value.push({
      text: "Oops, something went wrong!",
      user: false,
    });
    isBotTyping.value = false;
    console.error('Error analyzing receipt:', error);
    scrollToBottom();
  }
};
const closeDialog = () => {
  cropDialog.value = false;
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
};
const handleKeydown = (event: KeyboardEvent) => {
  const textarea = event.target as HTMLTextAreaElement;
  if (event.shiftKey) {
    input.value += '';
  } else {
    event.preventDefault();
    textarea.blur();
    textareaRowCount.value = 2;
    isStartingChat.value = false;
    sendMessage();
  }
};
const submitPrompt = async () => {
  const textarea = document.querySelector('.textarea-input') as HTMLTextAreaElement;
  textarea?.blur();
  textareaRowCount.value = 2;
  isStartingChat.value = false;
  sendMessage();
};
const updateFocus = async () => {
  messages.value.forEach((message) => {
    message.isFocus = false;
  });
  if (messages.value.length > 0) {
    messages.value[messages.value.length - 1].isFocus = true;
  }
};

const focusMessage = () => {
  const element = document.querySelector('.focusable');
  
  if (element instanceof HTMLElement) {
    element.focus(); 
  } else {
    console.error('No element with the class .focusable found or it is not an HTMLElement');
  }
};
// Method to select a file
const selectFile = () => {
  importRecipt.value?.click();
};

// Method to scroll to the bottom after each message
const scrollToBottom = () => {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
    }
  });
};

// Update image and add it to the chat
const updateImage = (file: File) => {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    selectedImageSrc.value = event?.target?.result as string;
    cropDialog.value = true;
    nextTick(() => {
      initCropper();
    });
    // if (typeof result === 'string') {
    //   messages.value.push({ image: result, user: true });
    //   scrollToBottom();
    // }
  };
  reader.readAsDataURL(file);
};

// Handle file selection
const onFileSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input?.files?.[0];
  if (!file) return;

  updateImage(file);


};

// Send user input message to bot and get response
const sendMessage = async () => {
  loadingSubmit.value = true;
  const userInput = input.value.trim();
  if (userInput) {
    messages.value.push({ text: formattedText(userInput), user: true });
    input.value = '';
    isBotTyping.value = true;

    try {
      const response = await axiosInstance.get(`/api/send-prompt`, {
        params: { prompt: userInput },
      });
      const promptResponse = response.data;
      if (promptResponse?.expense) {
        messages.value.push({ text: "Your expense details updated!", user: false, hasExpense: true, data: promptResponse.expense });
      } else if (promptResponse?.report) {
        messages.value.push({ text: `<strong>${promptResponse.report.title}</strong>`, user: false, hasReport: true, data: promptResponse });
      } else {
        messages.value.push({ text: "Sorry, there was an error processing your request.", user: false });
      }
    } catch (error) {
      messages.value.push({ text: "Sorry, there was an error processing your request.", user: false });
      console.error('Error processing user input:', error);
    }
    loadingSubmit.value = false;
    isBotTyping.value = false;
    await updateFocus();
    focusMessage();
  }
};
onMounted(async () => {
  if(isSmallDevice()){
    appStore.setDrawerState(true);
  }
  if(appStore.getMessages().length > 1){
    isStartingChat.value = false;
    textareaRowCount.value = 2;
  }else{
    isStartingChat.value = true;
    showSuggest.value = true;
  }
  currentUser.value = await getCurrentUser();
  isuserHasExpenses();
  if (!currentUser.value) {
    router.push('/');
  }
  try {
    const result = await axiosInstance.get(`/api/get-prompt-suggest`)
    if (result.data.length > 0) {
      suggest.value = result.data;
    }
  } catch (error) {
    console.log(error);
  }
});
</script>

<style >
.gradient-btn:hover {
  background: hsla(138, 82%, 69%, 1);
  background: linear-gradient(180deg, hsla(138, 82%, 69%, 1) 0%, hsla(186, 100%, 50%, 1) 100%);
  background: -moz-linear-gradient(180deg, hsla(138, 82%, 69%, 1) 0%, hsla(186, 100%, 50%, 1) 100%);
  background: -webkit-linear-gradient(180deg, hsla(138, 82%, 69%, 1) 0%, hsla(186, 100%, 50%, 1) 100%);
}
.content-container-sm {
  height: calc(100vh - 180px);
  overflow-y: auto;
}

.content-container-md {
  height: calc(100vh - 130px);
  overflow-y: auto;
}

.chat-container {
  height: calc(100vh - 64px);
  overflow-y: auto;
  padding-bottom: 80px;
}

.caption-input {
  font-size: 10px;
  text-align: right;
  display: block;
  padding-right: 25px;
  padding-bottom: 2px;
  text-transform: lowercase;
  color: #c8c4c4;
}

.chat-box {
  max-height: 100%;
  overflow-y: auto;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 400px;
  overflow: hidden;
  background: #f9f9f9;
}

.cropped-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.chat-input {
  max-width: 700px;
  width: 90%;
}

.input-section {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: white;
}

.message-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-message {
  justify-content: flex-end;
}

.message-bot {
  color: white;
  background-color: #8a8a8a;
  border-radius: 10px;
  padding: 10px;
  max-width: 400px;
}

.message-user {
  background-color: #f3f3f3;
  border-radius: 10px;
  padding: 10px;
  max-width: 400px;
}

.bot-message {
  justify-content: flex-start;
}

.bot-avatar {
  margin-right: 10px;
}

.message-user .message-bot {
  max-width: 70%;
}

.message-text {
  word-wrap: break-word;
}

.loading-dots {
  display: flex;
  gap: 5px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background-color: rgb(182, 182, 182);
  border-radius: 50%;
  animation: loading 1.4s infinite;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

/* Custom Scrollbar */
.content-container::-webkit-scrollbar {
  width: 10px;
  /* Width of the scrollbar */
}

.content-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  /* Track color */
  border-radius: 5px;
}

.content-container::-webkit-scrollbar-thumb {
  background: #888;
  /* Scrollbar color */
  border-radius: 5px;
}

.content-container::-webkit-scrollbar-thumb:hover {
  background: #555;
  /* Scrollbar hover color */
}

/* For other browsers */
.content-container {
  scrollbar-width: thin;
  /* Firefox scrollbar width */
  scrollbar-color: #888 #f1f1f1;
  /* Scrollbar and track colors */
}

@keyframes loading {

  0%,
  80%,
  100% {
    transform: scale(0);
  }

  40% {
    transform: scale(1);
  }
}
</style>
