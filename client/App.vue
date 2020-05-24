<template>
  <img alt="Vue logo" src="./logo.png" />
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
  <div v-for="(m, index) in messages" :key="index">
    {{ m }}
  </div>
  <form @submit.prevent="onSendMessage">
    <input type="text" />
    <button>Send</button>
  </form>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  data: () => ({
    ws: null,
    messages: [],
  }),
  methods: {
    onReceiveMessage({ data }) {
      this.messages = [...this.messages, data];
    },
    onSendMessage(e) {
      console.log(e)
      const msg = e.target[0].value;

      this.ws.send(msg);
      e.target[0].value = "";
    },
  },
  mounted() {
    if (this.ws) this.ws.close();
    this.ws = new WebSocket(`ws://localhost:5000/ws`);
    this.ws.addEventListener("message", this.onReceiveMessage);
  },
  beforeUnmount() {
    this.ws.removeEventListener("message", this.onReceiveMessage);
  },
  components: {
    HelloWorld,
  },
};
</script>
