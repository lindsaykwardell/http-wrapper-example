import {
  Server,
  Router,
  Socket,
} from "https://deno.land/x/http_wrapper@v0.4.0/mod.ts";
import * as flags from "https://deno.land/std/flags/mod.ts";

const { args, exit } = Deno;
const DEFAULT_PORT = 5000;
const argPort = flags.parse(args).port;
const port = argPort ? Number(argPort) : DEFAULT_PORT;

const router = new Router();
const socket = new Socket("/ws");

socket.on("message", (msg, connId) => {
  socket.emit("message", `[${connId}]: ${msg.body}`);
});

router.get("/old", async (req) => {
  req.respond({
    status: 200,
    headers: new Headers({
      "content-type": "text/html",
    }),
    body: await Deno.open("./index.html"),
  });
});

const testRouter = new Router("/bob");
testRouter.get("/", (req) => {
  req.respond({
    status: 200,
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify({
      test: "This is a test",
    }),
  });
});

const app = new Server();
app.use(router.routes);
app.use(testRouter.routes);
app.use(socket.routes);
app.static("client/dist", "/");

app
  .start({ port })
  .then((config) => console.log(`Server running on localhost:${config.port}`));
