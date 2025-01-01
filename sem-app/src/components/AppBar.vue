<template>
  <div>
      <v-app-bar flat height="30" class="bg-color" >
    <template #prepend>
            <v-avatar  class="ml-1" size="25" rounded="0">
                <v-img link to="/" src="../assets/SEM-favicon.svg" loading="lazy"></v-img>
            </v-avatar>
        </template>
        <v-app-bar-title class="text-body-1 text-white ml-2">{{pageTitle}}</v-app-bar-title>
        <!-- <template #title>
            <span class="text-body-1">Smart Expense Manager</span>
        </template> -->

        <v-spacer></v-spacer>
        <v-btn  @click="toggleDrawer()" color="white" icon="mdi mdi-menu" variant="text"></v-btn>
      </v-app-bar>

      <v-navigation-drawer width="200" v-model="drawer" app>
        <v-list class="pa-0">
          <v-list-item :title="userName">
            <template #append>
              <v-img v-if="photoURL !== ''" alt="Avatar" :src="photoURL"></v-img>
              <span v-else class="text-h5">{{ userName }}</span>
            </template>
          </v-list-item>
        </v-list>
        <v-divider class="pa-1"></v-divider>
        <v-list class="pa-0">
          <v-list-item link to="/chat" title="Smart Agent" append-icon="mdi-face-agent"></v-list-item>
          <v-list-item link to="/dashboard" title="Dashboard" append-icon="mdi-monitor-dashboard"></v-list-item>
        </v-list>
        <template v-slot:append>
          <v-list :class="{ 'pb-8 mb-1' : route.name === '/chat' }">
          <v-list-item link @click="appStore.showDialog" title="Contact Us" append-icon="mdi mdi-phone"></v-list-item>
          <v-list-item link @click="signOutUser" title="Sign Out" append-icon="mdi mdi-account-arrow-left"></v-list-item>
        </v-list>
        </template>
      </v-navigation-drawer>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, getCurrentInstance,onMounted } from 'vue';
import { useAppStore } from '../stores/app';
import { useRoute } from 'vue-router';
import { logOut } from '../services/authService';
import router from '../router';
import { getCurrentUser } from '../services/authService';
const instance = getCurrentInstance();
const showSuccessToast = instance?.appContext.config.globalProperties.$showSuccessToast;
const route = useRoute();
const pageTitle = ref(route.name === '/chat' ? 'AI ChatBot':'Dashboard');
const photoURL = ref();
const userName = ref();
// Watch for route changes and update `showAppBar` accordingly
watch(() => route.name, (newRoute) => {
  pageTitle.value = newRoute === '/chat' ? 'AI ChatBot':'Dashboard';
});
const appStore = useAppStore();
const drawer = ref(appStore.drawer);
watch(
  () => appStore.drawer,
  (newValue) => {
    drawer.value = newValue; 
  }
);
const signOutUser = async () => {
  try {
    await logOut();
    showNotify("Sign out success!")
    router.push('/');
  } catch (error) {
    console.error('signout user error:',error);
  }
}
const showNotify = (msg: string) => {
  if(showSuccessToast){
    showSuccessToast(msg);
  }else{
    console.log("show notify error ");
  }
};
const toggleDrawer = () => {
  drawer.value = !drawer.value;
  appStore.setDrawerState(drawer.value);
}
onMounted(async () => {
  const user = await getCurrentUser();
  if(user){
    photoURL.value = user?.photoURL;
    userName.value = user?.displayName ? user.displayName : user.email;
  }
});
</script>
<style>
.bg-color {
background: linear-gradient(to left, #78ffd6, #007991) !important;
}
</style>