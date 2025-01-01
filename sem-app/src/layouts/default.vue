<template>
  <v-app>
    <app-bar v-if="showAppBar"/>
    <v-main>
      <router-view />
      <contact-us />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { watch, ref } from 'vue';

const route = useRoute();
const showAppBar = ref(route.name !== '/');

// Watch for route changes and update `showAppBar` accordingly
watch(() => route.name, (newRoute) => {
  showAppBar.value = newRoute !== '/';
});
</script>
