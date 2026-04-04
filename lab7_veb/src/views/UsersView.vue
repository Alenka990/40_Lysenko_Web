<template>
  <div v-if="loading">Загрузка...</div>
  <div v-else>
    <div v-for="user in store.users" :key="user.id" class="user">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../stores/dataStore';
import { ref } from 'vue';

const store = useDataStore();
const loading = ref(true);

store.fetchUsers().then(() => {
  loading.value = false;
});
</script>

<style scoped>
.user {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
}
</style>
