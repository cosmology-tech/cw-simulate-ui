/// <reference lib="WebWorker" />

// export empty type because of tsc --isolatedModules flag
addEventListener('message', (event) => {
    // event is an ExtendableMessageEvent object
    console.log(`The client sent me a message: ${event.data.message??event.data}`);
  
    event.source?.postMessage("Hi client");


    if (event.data.name === 'COMPILE') {
      console.log('yo',event.data.data);
    }

  });

