<template>
  <div v-if="showForm" class="form-box">
    <input v-model="title" type="text" placeholder="Заголовок" />
    <textarea v-model="body" rows="3" placeholder="Текст поста"></textarea>
    <div class="form-buttons">
      <button @click="cancel" class="cancel">Отмена</button>
      <button @click="submit" class="submit">Создать</button>
    </div>
  </div>
  <button @click="showForm = true" class="refresh-btn" v-if="!showForm">
    + Создать пост
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDataStore } from '../stores/dataStore';

const store = useDataStore();
const showForm = ref(false);
const title = ref('');
const body = ref('');

const cancel = () => {
  showForm.value = false;
  title.value = '';
  body.value = '';
};

const submit = async () => {
  if (!title.value.trim() || !body.value.trim()) {
    alert('Заполните все поля');
    return;
  }

  const newPost = {
    id: Date.now(),
    title: title.value,
    body: body.value,
    userId: 1,
  };

  store.addPost(newPost);
  cancel();
};
</script>

<style scoped>
.form-box {
  background: #1a1e2c;
  border: 1px solid #2d3348;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
}
.form-box input,
.form-box textarea {
  width: 100%;
  padding: 8px 10px;
  margin-bottom: 10px;
  background: #0f121f;
  border: 1px solid #2d3348;
  border-radius: 8px;
  color: white;
}
.form-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
.submit {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 15px;
  border-radius: 20px;
  cursor: pointer;
}
.cancel {
  background: #2d3348;
  color: #cbd5e1;
  border: none;
  padding: 6px 15px;
  border-radius: 20px;
  cursor: pointer;
}
.refresh-btn {
  background: #252b3d;
  border: none;
  padding: 6px 15px;
  border-radius: 20px;
  color: #60a5fa;
  cursor: pointer;
  margin-bottom: 15px;
}
</style>
