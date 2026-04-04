export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
}

export interface Fact {
  fact: string;
  length: number;
}
