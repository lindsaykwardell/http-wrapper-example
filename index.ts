import { acceptWebSocket, acceptable } from "https://deno.land/std/ws/mod.ts";
import { chat } from "./chat.ts";
import { Server, Router } from "https://deno.land/x/http_wrapper@dev/mod.ts";

const router = new Router();

// router.get("/", async (req) => {
//   req.respond({
//     status: 200,
//     headers: new Headers({
//       "content-type": "text/html",
//     }),
//     body: await Deno.open("./index.html"),
//   });
// });

router.get("/ws", (req) => {
  if (acceptable(req)) {
    acceptWebSocket({
      conn: req.conn,
      bufReader: req.r,
      bufWriter: req.w,
      headers: req.headers,
    }).then(chat);
  }
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
app.static("client/dist", "/");

app
  .start({ port: 3000 })
  .then((config) => console.log(`Server running on localhost:${config.port}`));
