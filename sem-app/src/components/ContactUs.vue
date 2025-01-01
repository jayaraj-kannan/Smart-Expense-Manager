<template>
    <v-dialog v-model="appStore.iscontactUsDialogVisible" max-width="600">
        <v-card class="mx-auto rounded-xl pa-4">
            <v-card-title v-if="isSupportEmailSent()">📩 We received your message!</v-card-title>
            <v-card-title v-else>📞 Contact the Developer</v-card-title>
            <v-card variant="flat" class="mx-auto rounded-xl" color="#f5f3ef">

                <v-card-text v-if="isSupportEmailSent()">🙌 Thank you for reaching out. We'll get in touch with you
                    soon!</v-card-text>
                <v-card-text v-else>
                    <span>
                        📝 Leave a message, and I’ll get back to you as soon as possible.Thank you for your support!
                        💡</span>

                    <div class="pb-4 pt-2 d-flex justify-center align-center">
                        <form @submit.prevent="sendEmail">
                            <v-text-field  required v-model="clientName" class="mx-auto"
                                density="compact" menu-icon="" placeholder="your name" label="name" clearable
                                prepend-inner-icon="mdi-account" theme="light" variant="solo" auto-select-first
                                item-props rounded>

                            </v-text-field>
                            <v-text-field  required type="email" v-model="clientEmail" class="mx-auto"
                                density="compact" menu-icon="" placeholder="your name" label="email" clearable
                                prepend-inner-icon="mdi-email" theme="light" variant="solo" auto-select-first item-props
                                rounded>

                            </v-text-field>
                            <v-textarea  required v-model="clientMessage" class="mx-auto" rows="2"
                                density="compact" menu-icon="" placeholder="your name" label="message" clearable
                                prepend-inner-icon="mdi mdi-message-text" theme="light" variant="solo" auto-select-first
                                item-props rounded></v-textarea>
                            <v-btn class="mx-auto gradient-btn" :loading="loadingSend" type="submit" 
                                rounded="lg" color="#87f4b5" block>send</v-btn>
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
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useAppStore } from '../stores/app';
import config from "../resources/config";
import emailjs from '@emailjs/browser';
import { toast, type ToastOptions } from 'vue3-toastify';
import "vue3-toastify/dist/index.css";

const socialConnectItems = config.socialConnect;
const appStore = useAppStore();
const emailJsEnv = config.envVariables.emailjs;
const loadingSend = ref(false);
const clientName = ref('');
const clientMessage = ref('');
const clientEmail = ref('');
const isSupportEmailSent = () => {
    const storedValue = localStorage.getItem('contact-sem-app');
    return storedValue ? JSON.parse(storedValue) : false;
}
const sendEmail = () => {
    loadingSend.value = true;
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
        localStorage.setItem('contact-sem-app', "true");
        appStore.hideDialog();
        showSuccessToast("got your message, will connect you soon 🫡!");
    }).catch((error) => {
        console.error('Failed to send email', error);
    });
}
const showSuccessToast = (msg: string) => {
    toast(msg, {
        autoClose: 2500,
        position: toast.POSITION.TOP_RIGHT,
    } as ToastOptions);
};
</script>