<template>
  <v-app id="inspire">
    <v-app-bar v-if="!loading" flat height="40" app color="#8de9d5" class="sticky-app-bar">
      <template #prepend>
        <v-avatar class="ml-2" size="30" rounded="0">
          <v-img src="@/assets/SEM-favicon.svg" loading="lazy" alt="SEM Logo"></v-img>
        </v-avatar>
      </template>
      <span class="text-subtitle-1 ml-2">Smart Expense Manager</span>
      <v-spacer></v-spacer>
      <v-btn v-if="!currentUser" class="hidden-md-and-down mr-2" rounded="lg" size="small"  @click="handleOnClick('contactus')" color="#09685C">Contact
        us</v-btn>
      <v-btn v-if="!currentUser" class="hidden-md-and-down mr-2" rounded="lg" size="small" variant="flat"
        color="#19b09d" @click="authDialog = true">sign in</v-btn>
      <v-menu v-model="authDrawer" :close-on-content-click="false" location="top">
        <template v-slot:activator="{ props }">
          <v-avatar  size="35" class="mr-2 cursor-pointer" :class="{ 'hidden-md-and-up': !currentUser }" :color="currentUser && !currentUser.photoURL ? 'grey' : ''" v-bind="props">
            <v-img v-if="currentUser && currentUser.photoURL" alt="Avatar" :src="currentUser.photoURL"></v-img>
            <v-icon v-if="!currentUser" color="white">mdi mdi-menu</v-icon>
            <span v-if="currentUser && !currentUser.photoURL" class="text-h5">{{ currentUser.email[0].toUpperCase() }}</span>
          </v-avatar>
        </template>

        <v-card min-width="150" variant="flat" class="rounded-lg">
          <v-list>
            <v-list-item v-for="(item, index)  in (currentUser ? authenticatedMenuList : noAuthenticatedMenuList)"
              :key="index" class="pl-5" :to="item.link ? item.link : undefined"
              @click="item.action ? handleOnClick(item.action) : null">
              <template #prepend>
                <v-icon>{{ item.icon }}</v-icon>
                <span class="pl-2">{{ item.text }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>
    <v-container v-if="loading" fluid class="d-flex fill-height justify-center align-center">
      <v-progress-circular indeterminate color="#19b09d" size="54" width="6" class="ma-auto"></v-progress-circular>
    </v-container>
    <v-card v-else class="fill-height scrollable-content" variant="flat" color="#8de9d5">

      <v-card-text class="pt-2">
        <v-row dense>
          <v-col cols="12" md="4">
            <v-card class="mx-auto rounded-xl " variant="flat" color="white" max-width="344">
              <v-img aspect-ratio="1/1" max-height="300" :src="bannerImage"></v-img>
            </v-card>
          </v-col>
          <v-col cols="12" md="8">
            <v-card class="mx-auto ml-0 pt-4 pb-4" variant="flat" color="#8de9d5">
              <span class="text-h6 text-strong pb-2">{{ bannerHead }}</span><span class="caret"></span><br>
              <span class="text-h7 pt-2" v-html="bannerInfo"></span>
              <div>
                <v-chip v-for="(chip, index) in bannerChip" :key="index" class="ma-1" variant="flat" color="white">
                  {{ chip }}
                </v-chip>
              </div>

            </v-card>
          </v-col>
        </v-row>

        <v-card class="ma-5" title="Key Features" variant="flat" color="#8de9d5">
          <v-row>
            <v-col cols="12" v-for="(feature, index) in featuresItems" :key="index" md="4">
              <v-card variant="flat" class="mx-auto rounded-xl pa-2 ma-0">
                <v-card variant="flat" color="white">
                  <template #prepend>
                    <v-icon :color="feature.iconColor">{{ feature.icon }}</v-icon>
                  </template>
                  <template #title>
                    <span class="text-subtitle-2">{{ feature.title }}</span>
                  </template>
                  <v-card-text>
                    <span>{{ feature.info }}</span>
                    <v-card class="mx-auto rounded-lg mt-2" variant="flat" color="#f5f3ef">
                      <v-img aspect-ratio="1/1" max-height="300" :src="feature.image"></v-img>
                    </v-card>

                  </v-card-text>
                </v-card>
              </v-card>
            </v-col>
          </v-row>

        </v-card>
      </v-card-text>
      <template v-slot:actions>
        <v-row justify="center" class="mb-2">
          <!-- <v-col cols="12" class="text-center"  md="4">
            <v-btn v-for="(social, index) in socialConnectItems" :href="social.name" target="_blank" :key="index" :color="social.color" :icon="social.icon" class="pr-2"></v-btn>
          </v-col>
          <v-col cols="12" class="text-center hidden-md-and-up"  md="4">
           
          </v-col> -->
          <v-col cols="12" class="text-center">
            <div class="text-caption">©️ made by 🧘🏽 <a class="footer-text" :href="config.profileLink" target="_blank"
                rel="noopener noreferrer">@jayaraj_kannan</a></div>
          </v-col>
        </v-row>
      </template>


      <v-btn size="35" icon="mdi mdi-help" fab color="grey" class="floating-fab" @click="helpDialog = true">
      </v-btn>
    </v-card>
    <v-dialog v-model="authDialog" persistent max-width="600">
      <v-card class="mx-auto rounded-lg pa-4">
        <v-card variant="flat" class="mx-auto rounded-xl" color="#f5f3ef">
          <!-- Dynamic Title -->
          <v-card-title class="text-h6 text-center">
            {{ isSignIn ? "Sign In" : "Sign Up" }}
          </v-card-title>

          <!-- Dialog Content -->
          <v-card-text>
            <v-form ref="authForm">
              <v-text-field label="Email" v-model="email" :rules="[rules.email, rules.required]"
                type="email"></v-text-field>

              <v-text-field label="Password" v-model="password" :rules="[rules.minLength, rules.required]"
                type="password"></v-text-field>

              <!-- Additional fields for Sign-Up -->
              <v-text-field v-if="!isSignIn" v-model="confirmPassword" :rules="[rules.matchPassword, rules.required]"
                label="Confirm Password" type="password"></v-text-field>
            </v-form>
            <span v-if="isSignIn && showSignInWithPopup()"  class="d-flex align-center justify-center">or</span>
            <v-btn v-if="isSignIn && showSignInWithPopup()"  class="mt-3" variant="flat" color="#545454" block @click="googleSignIn">
              <template #prepend>
                <img src="../assets/images/login-google.svg" />
              </template>
              Sign In with Google
            </v-btn>
          </v-card-text>
          <!-- Dialog Actions -->
          <v-card-actions>

            <v-spacer></v-spacer>
            <v-btn @click="closeDialog" :disabled="loadingSignIn || loadingSignUp">Cancel</v-btn>
            <v-btn color="primary" :loading="loadingSignIn || loadingSignUp" @click="handleSubmit">
              {{ isSignIn ? "Sign In" : "Sign Up" }}
            </v-btn>
          </v-card-actions>
          <!-- Switch Option -->
          <v-card-actions class="justify-center">
            <v-btn color="primary text-none" :disabled="loadingSignIn || loadingSignUp" @click="toggleAuthMode">
              {{ isSignIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
    <v-dialog v-model="helpDialog" width="600">
      <v-card class="mx-auto rounded-xl pa-4">
        <v-card-title v-if="isSupportEmailSent()">📩 We received your message!</v-card-title>
        <v-card-title v-else>💬 Need Help or Support?</v-card-title>
        <v-card variant="flat" class="mx-auto rounded-xl" color="#f5f3ef">

          <v-card-text v-if="isSupportEmailSent()">🙌 Thank you for reaching out. We'll get in touch with you
            soon!</v-card-text>
          <v-card-text v-else>
            <span>❓ If you have any issues, concerns, or suggestions, please don't hesitate to leave a message.
              ⏳ I’ll get back to you as soon as possible!
              🙏 Your feedback is greatly appreciated and helps improve the app.</span>

            <div class="pb-4 pt-2 d-flex justify-center align-center">
              <form @submit.prevent="sendEmail">
                <v-text-field  required v-model="clientName" class="mx-auto" density="compact"
                  menu-icon="" placeholder="your name" label="name" clearable prepend-inner-icon="mdi-account"
                  theme="light" variant="solo" auto-select-first item-props rounded>

                </v-text-field>
                <v-text-field  required type="email" v-model="clientEmail" class="mx-auto"
                  density="compact" menu-icon="" placeholder="your name" label="email" clearable
                  prepend-inner-icon="mdi-email" theme="light" variant="solo" auto-select-first item-props rounded>

                </v-text-field>
                <v-textarea  required v-model="clientMessage" class="mx-auto" rows="2" density="compact"
                  menu-icon="" placeholder="your name" label="message" clearable
                  prepend-inner-icon="mdi mdi-message-text" theme="light" variant="solo" auto-select-first item-props
                  rounded></v-textarea>
                <v-btn class="mx-auto gradient-btn" :loading="loadingSupport" type="submit"  rounded="lg" color="#87f4b5"
                  block>send</v-btn>
              </form>
            </div>
          </v-card-text>
        </v-card>
        <v-card-actions>
                <v-row justify="center">
                    <v-col cols="12" class="text-center pa-0">
                        <v-btn v-for="(social, index) in socialConnectItems" :href="social.name" target="_blank"
                            :key="index" :color="social.color" :icon="social.icon" class="pr-2"></v-btn>
                    </v-col>
                    <v-col cols="12" class="text-center pa-0">
                        <div class="text-caption">©️ made by 🧘🏽 <a class="footer-text" :href="config.profileLink" target="_blank"
                            rel="noopener noreferrer">@jayaraj_kannan</a></div>
                    </v-col>
                </v-row>
            </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script lang="ts" setup>
import { onMounted, ref ,getCurrentInstance } from 'vue';
import { useDisplay } from 'vuetify';
import config from "../resources/config";
import emailjs from '@emailjs/browser';
import { getCurrentUser, signInWithGoogle, signInUser,signUpUser,logOut } from "../services/authService";
import { getErrorMessage } from '../services/firebaseErrorCodes';
// import { toast, type ToastOptions } from 'vue3-toastify';
// import "vue3-toastify/dist/index.css";
import { useAppStore } from '../stores/app';
import router from '../router/index';
import { FirebaseError } from 'firebase/app';

const appDisplay = useDisplay();
const instance = getCurrentInstance();
const showSuccessToast = instance?.appContext.config.globalProperties.$showSuccessToast;
const appStore = useAppStore();
const CONTACT_US: string = "contactus";
const SIGN_IN: string = "signin";
const SIGN_UP: string = "signup";
const SIGN_OUT: string = "signout";
const loading = ref(true);
const email = ref();
const password = ref();
const confirmPassword = ref();
const loadingSignIn = ref(false);
const loadingSupport = ref(false);
const loadingSignUp = ref(false);
const authDialog = ref(false);
const helpDialog = ref(false);
const authDrawer = ref(false);
const isSignIn = ref(true);
const bannerItems = config.bannerInfo;
const featuresItems = config.keyFeatures;
const emailJsEnv = config.envVariables.emailjs;
const socialConnectItems = config.socialConnect;
const bannerHead = ref("");
const bannerInfo = ref("");
const bannerImage = ref("");

const getFirebaseErrorMessage = (errorCode : string) => {
  return getErrorMessage(errorCode);
};
const showSignInWithPopup = () => {
  return !appDisplay.platform.value.android && !appDisplay.platform.value.ios
};
const isSupportEmailSent = () => {
  const storedValue = localStorage.getItem('support-sem-app');
  return storedValue ? JSON.parse(storedValue) : false;
}
const rules = {
  required: (value: string) => !!value || "This field is required.",
  email: (value: string) =>
    /.+@.+\..+/.test(value) || "Enter a valid email address.",
  minLength: (value: string) =>
    (value && value.length >= 6) ||
    "Password must be at least 6 characters long.",
  matchPassword: (value: string) =>
    value === password.value || "Passwords do not match.",
};
const handleOnClick = (action: string) => {
  if (action) {
    authDrawer.value = false;
    switch (action) {
      case SIGN_IN:
        signIn();
        break;

      case SIGN_OUT:
        signOut();
        break;

      case SIGN_UP:
        signUp();
        break;
      case CONTACT_US:
        constactUs();
        break;
      default:
        // Default case for unrecognized actions
        console.log("Unknown action:", action);
        break;
    }
  } else {
    console.log("No action provided");
  }
};

const signOut = async () => {
  try {
    await logOut();
    window.location.reload();
    showNotify('Sign out Success');
  } catch (error) {
    console.error('signout user error:',error);
  }
};
const constactUs = () => {
  appStore.showDialog();
};
const signIn = () => {
  authDialog.value = true;
};
const signUp = () => {
  authDialog.value = true;
  toggleAuthMode();
};
const showNotify = (msg: string) => {
  if(showSuccessToast){
    showSuccessToast(msg);
  }else{
    console.log("showSuccessToast error");
  }
};
const handleSubmit = async () => {
  if(isSignIn.value){
    loadingSignIn.value = true;
    try {
      await signInUser(email.value,password.value);
      authDialog.value = false;
      loadingSignIn.value = false;
      showNotify(`Sign In succesfull!`);
      router.push('/chat');
    } catch (error) {
      if (error instanceof FirebaseError) {
      showNotify(getFirebaseErrorMessage(error.code));
      }else{
        console.error("An unexpected error occurred:", error);
      }
      loadingSignIn.value = false;
    } 
  }else{
    loadingSignUp.value = true;
    try {
      await signUpUser(email.value,password.value);
      authDialog.value = false;
      loadingSignUp.value = false;
      showNotify(`Sign Up succesfull!`);
      router.push('/chat');
    } catch (error) {
      if (error instanceof FirebaseError) {
      showNotify(getFirebaseErrorMessage(error.code));
      }else{
        console.error("An unexpected error occurred:", error);
      }
    loadingSignUp.value = false;
    } 
  }
};

const authenticatedMenuList = [
  { text: 'AI Chatbot', icon: 'mdi mdi-robot', link: '/chat', action: null },
  { text: 'Dashboard', icon: 'mdi mdi-chart-box', link: '/dashboard', action: null },
  { text: 'Contact Us', icon: 'mdi mdi-phone', link: null, action: 'contactus' },
  { text: 'Sign Out', icon: 'mdi mdi-account-arrow-left', link: null, action: 'signout' },
];
const noAuthenticatedMenuList = [
  { text: 'Sign In', icon: 'mdi mdi-account-arrow-right', link: null, action: 'signin' },
  { text: 'Sign Up', icon: 'mdi mdi-account-plus', link: null, action: 'signup' },
  { text: 'Contact Us', icon: 'mdi mdi-phone', link: null, action: 'contactus' },
];
const bannerChip = ref<string[]>([]);
let currentIndex = 0;
let charIndex = 0;
let isClearing = false;
const closeDialog = () => {
  authDialog.value = false;
}
const googleSignIn = async () => {
  try {
    await signInWithGoogle();
    authDialog.value = false;
    router.push('/chat');
  } catch (error) {
    console.error(error);
  }
}

const clientName = ref('');
const clientMessage = ref('');
const clientEmail = ref('');
const sendEmail = () => {
  loadingSupport.value = true;
  emailjs.send(
    emailJsEnv.serviceId,
    emailJsEnv.templateId,
    {
      from_name: clientName.value,
      to_name: emailJsEnv.name,
      from_email: clientEmail.value,
      to_email: emailJsEnv.email,
      message: clientMessage.value
    },
    emailJsEnv.publcKey
  ).then(() => {
    localStorage.setItem('support-sem-app', "true");
    loadingSupport.value = false;
    helpDialog.value = false;
    showNotify("got your message, will connect you soon 🫡!");
  }).catch((error) => {
    console.error('Failed to send email', error);
  });

}
const toggleAuthMode = () => {
  isSignIn.value = !isSignIn.value;
}
const animateText = () => {
  const currentItem = bannerItems[currentIndex];
  const content = currentItem.head;

  if (!isClearing) {
    if (charIndex < content.length) {
      bannerHead.value += content.charAt(charIndex);
      charIndex++;
      setTimeout(animateText, 60);
    } else {
      isClearing = true;
      setTimeout(animateText, 4500);
    }
  } else {
    if (bannerHead.value.length > 0) {
      bannerHead.value = bannerHead.value.slice(0, -1);
      setTimeout(animateText, 20);
    } else {
      isClearing = false;
      currentIndex = (currentIndex + 1) % bannerItems.length;
      charIndex = 0;
      bannerChip.value = bannerItems[currentIndex].chip;
      bannerImage.value = bannerItems[currentIndex].image;
      bannerInfo.value = bannerItems[currentIndex].info;
      setTimeout(animateText, 1000);
    }
  }
};
const currentUser = ref();
onMounted(async () => {
  bannerImage.value = bannerItems[0].image;
  bannerInfo.value = bannerItems[0].info;
  bannerChip.value = bannerItems[0].chip;
  setTimeout(animateText, 1000);
  currentUser.value = await getCurrentUser();
  setTimeout(() => {
    loading.value = false;
  }, 2000);
});

</script>
<style>
.gradient-btn:hover {
  background: hsla(138, 82%, 69%, 1);
  background: linear-gradient(180deg, hsla(138, 82%, 69%, 1) 0%, hsla(186, 100%, 50%, 1) 100%);
  background: -moz-linear-gradient(180deg, hsla(138, 82%, 69%, 1) 0%, hsla(186, 100%, 50%, 1) 100%);
  background: -webkit-linear-gradient(180deg, hsla(138, 82%, 69%, 1) 0%, hsla(186, 100%, 50%, 1) 100%);
}

.full-height {
  height: 100vh;
  /* Makes the card occupy the full viewport height */
  display: flex;
  flex-direction: column;
}

.scrollable-content {
  height: calc(100vh - 40px) !important;
  overflow-y: auto !important;
}

/* Optional: Customize scrollbar appearance */
.scrollable-content::-webkit-scrollbar {
  width: 8px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background-color: #cccccc;
  border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background-color: #aaaaaa;
}

@keyframes blink {
  0% {
    opacity: 1;
  }

  49% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

.floating-fab {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 1000;
}

.caret {
  display: inline-block;
  background-color: rgb(255, 255, 255);
  width: 12px;
  height: 25px;
  margin-left: 4px;
  animation: blink 0.5s infinite;
  font-size: 18px;
}

.caret::after {
  content: '';
  display: inline-block;
  background-color: rgb(0, 0, 0);
  margin-left: 4px;
  animation: blink 0.3s infinite;
}

.text {
  font-size: 24px;
  font-weight: 400;
}

.sticky-app-bar {
  position: sticky !important;
  top: 0 !important;
  z-index: 1000 !important;
  /* Adjust as needed to ensure it stays above other elements */
}
</style>