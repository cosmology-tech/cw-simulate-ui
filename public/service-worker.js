/// <reference lib="WebWorker" />

// export empty type because of tsc --isolatedModules flag

addEventListener("message", (event) => {
  // event is an ExtendableMessageEvent object
  console.log(
    `The client sent me a message: ${event.data.message ?? event.data}`
  );

  event.source?.postMessage("Hi client");
  console.log('Hey I a, triggerd');
  if (event.data.name === "COMPILE") {
    const {wasmBuffer, backend} = event.data.data;
    console.log(wasmBuffer, backend);

    console.log(new VMInstance(wasmBuffer, backend));
    console.log("Done with the vm", event.data.data);
  }
});
