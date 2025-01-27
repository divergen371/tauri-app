import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";
import { emit, listen } from "@tauri-apps/api/event";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  async function executeCommands() {
    invoke("simple_command");
  }

  invoke("command_with_object", {
    message: { field_str: "some message", field_u32: 12 },
  }).then((message) => {
    console.log("command_with_object", message);
  });

  function openDialog() {
    open().then((files) => console.log(files));
  }

  function emitMessage() {
    emit("front-to-back", "hello from front");
  }

  useEffect(() => {
    let unlisten: any;
    async function f() {
      unlisten = await listen("back-to-front", (event) => {
        console.log(`back-to-front ${event.payload} ${new Date()}`);
      });
    }
    f();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p>

      <div>Hello Tauri</div>
      <button onClick={executeCommands}>Click to execute command</button>
      <button onClick={openDialog}>Click to open dialog</button>
      <button onClick={emitMessage}>Click to emit message</button>
    </div>
  );
}

export default App;
