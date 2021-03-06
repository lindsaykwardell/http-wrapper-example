<template>
  <div>
    <img alt="Vue logo" src="./logo.png" class="m-auto" />
    <div class="w-full md:w-2/3 p-4 m-auto">
      <div class="chat-box">
        <div v-for="(m, index) in messages" :key="index">
          {{ m }}
        </div>
      </div>
      <form @submit.prevent="onSendMessage">
        <div class="flex mt-4">
          <input type="text" class="shadow-md h-12 w-full flex-grow border" />
          <button
            class="flex-shrink w-32 bg-blue-300 hover:bg-blue-500 transition duration-200 shadow-md"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import { reactive, ref, onMounted, onBeforeUnmount, computed } from "vue";

export default {
  name: "App",
  setup() {
    const state = reactive({ ws: null });
    const messages = ref([]);

    const SOCKET_HOST = window.location.host.includes("localhost")
      ? "localhost:5000"
      : window.location.host;

    const onReceiveMessage = ({ data }) => {
      const msg = JSON.parse(data);
      messages.value = [...messages.value, msg.body];
    };

    const onSendMessage = (e) => {
      const msg = e.target[0].value;
      state.ws.send(
        JSON.stringify({
          event: "message",
          body: msg,
        })
      );
      e.target[0].value = "";
    };

    const protocol = computed(() => {
      return location.protocol !== "https:" ? "ws" : "wss";
    });

    onMounted(() => {
      if (state.ws) state.ws.close();

      state.ws = new WebSocket(`${protocol.value}://${SOCKET_HOST}/ws`);
      state.ws.addEventListener("message", onReceiveMessage);
    });

    onBeforeUnmount(() => {
      state.ws.removeEventListener("message", onReceiveMessage);
    });

    return {
      messages,
      onSendMessage,
    };
  },
};
</script>

<style lang="postcss">
@tailwind base;

@tailwind components;

@tailwind utilities;

.chat-box {
  @apply shadow-md border overflow-y-scroll;
  max-height: 500px;
  min-height: 40vh;
}
</style>
