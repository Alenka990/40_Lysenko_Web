<template>
  <div v-if="loading">Загрузка...</div>
  <div v-else>
    <div v-for="(fact, idx) in store.facts" :key="idx" class="fact">
      <p>🐱 {{ fact.fact }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../stores/dataStore';
import { ref } from 'vue';

const store = useDataStore();
const loading = ref(true);

store.fetchFacts().then(() => {
  loading.value = false;
});
</script>

<style scoped>
.fact {
  border-left: 3px solid orange;
  padding: 10px;
  margin: 10px 0;
  background: #f9f9f9;
}
</style>
