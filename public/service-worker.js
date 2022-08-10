/// <reference lib="WebWorker" />

// export empty type because of tsc --isolatedModules flag
addEventListener('message', (event) => {
    // event is an ExtendableMessageEvent object
    console.log(`The client sent me a message: ${event.data}`);
  
    event.source?.postMessage("Hi client");

    if (event.name === 'COMPILE') {
      console.log(navigator.wasmbuffer);
    }

  });

