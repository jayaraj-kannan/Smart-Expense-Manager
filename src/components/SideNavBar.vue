<template>
    <v-navigation-drawer app width="150">
        <v-list>
            <v-list-item>
                <router-link to="/Home" class="router-link">
                    <v-list-item-content>
                        <v-list-item-title>Chat with Agent</v-list-item-title>
                    </v-list-item-content>
                </router-link>
            </v-list-item>
            <!-- Add more navigation items here -->
            <v-list-item>
                <router-link to="/dashboard" class="router-link">
                    <v-list-item-content>
                        <v-list-item-title>Dashboard</v-list-item-title>
                    </v-list-item-content>
                </router-link>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts" setup>
// No additional setup needed for this simple component
</script>

<style scoped>
/* Styling the router-link to match Vuetify's styles */
.router-link {
    text-decoration: none;
    color: inherit;
    display: block;
}

.router-link:hover {
    color: var(--v-primary-base); /* Change color on hover */
}
</style>
