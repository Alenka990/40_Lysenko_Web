<template>
  <div class="post">
    <h3>📌 {{ post.title }}</h3>
    <p>{{ post.body }}</p>
    <div class="post-buttons">
      <button @click="edit" class="edit-btn">✎</button>
      <button @click="remove" class="delete-btn">🗑</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '../types';
import { useDataStore } from '../stores/dataStore';

const props = defineProps<{ post: Post }>();
const store = useDataStore();

const edit = () => {
  const newTitle = prompt('Новый заголовок:', props.post.title);
  if (!newTitle) return;
  const newBody = prompt('Новый текст:', props.post.body);
  if (!newBody) return;
  store.updatePost(props.post.id, {
    ...props.post,
    title: newTitle,
    body: newBody,
  });
};

const remove = () => {
  if (confirm('Удалить пост?')) {
    store.deletePost(props.post.id);
  }
};
</script>

<style scoped>
.post {
  background: #1a1e2c;
  border: 1px solid #2d3348;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
}
.post h3 {
  color: #60a5fa;
  margin-bottom: 8px;
}
.post-buttons {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
.edit-btn {
  background: #1e3a5f;
  color: #60a5fa;
  border: none;
  padding: 5px 12px;
  border-radius: 15px;
  cursor: pointer;
}
.delete-btn {
  background: #5f1e1e;
  color: #f87171;
  border: none;
  padding: 5px 12px;
  border-radius: 15px;
  cursor: pointer;
}
</style>
