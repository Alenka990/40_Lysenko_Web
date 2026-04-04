<template>
  <div v-if="loading">Загрузка...</div>
  <div v-else>
    <div v-for="post in store.posts" :key="post.id" class="post">
      <h3>{{ post.title }}</h3>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../stores/dataStore';
import { ref } from 'vue';

const store = useDataStore();
const loading = ref(true);

store.fetchPosts().then(() => {
  loading.value = false;
});
</script>

<style scoped>
.post {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
}
</style>
