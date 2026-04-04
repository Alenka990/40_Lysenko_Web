import { defineStore } from 'pinia';
import type { Post, User, Fact } from '../types';

export const useDataStore = defineStore('data', {
  state: () => ({
    posts: [] as Post[],
    users: [] as User[],
    facts: [] as Fact[],
  }),
  actions: {
    async fetchPosts() {
      const res = await fetch(
        'https://jsonplaceholder.typicode.com/posts?_limit=5'
      );
      this.posts = await res.json();
    },
    async fetchUsers() {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      this.users = await res.json();
    },
    async fetchFacts() {
      const res = await fetch('https://catfact.ninja/facts?limit=5');
      const data = await res.json();
      this.facts = data.data;
    },
    addPost(post: Post) {
      this.posts.unshift(post);
    },
    updatePost(id: number, updated: Post) {
      const index = this.posts.findIndex((p) => p.id === id);
      if (index !== -1) this.posts[index] = updated;
    },
    deletePost(id: number) {
      this.posts = this.posts.filter((p) => p.id !== id);
    },
  },
});
