import debug from "debug";
import http from "http";
import app from "./app";

const port: Number = +process.env.PORT! || 3000;

// error handler
const onError = (error: NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") throw error;
  switch (error.code) {
    case "EACCES":
      console.error(`Port ${port} requires elevated privileges.`);
      process.exit(1);
    case "EADDRINUSE":
      console.error(`Port ${port} is already in use.`);
      process.exit(1);
    default:
      throw error;
  }
};

const server = http.createServer(app);
server.listen(port);
server.on("error", onError);

// event listener
const onListening = () => {
  const address = server.address();
  const bind =
    typeof address === "string" ? `pipe ${address}` : `port ${address?.port}`;
  debug(`Listening on ${bind}`);
};

server.on("listening", onListening);
