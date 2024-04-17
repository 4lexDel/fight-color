// App.js
import React, { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {autoConnect: true}); // Remplace avec l'URL de ton serveur

function App() {
  // socket.connect();

  useEffect(() => {
    socket.on('welcome', (data) => {
      console.log('First message from server:', data);
    });

    socket.on('message', (data) => {
      console.log('Message from server:', data);
    });

    return () => {
      if (socket.readyState === 1) {
          socket.close();
      }
  }
  }, []);

  const sendMessageToServer = () => {
    const message = 'Hello, server!';
    console.log("socket.emit('message', message)");
    socket.emit('message', message); // Émet un message avec le sujet "clientMessage" vers le serveur
  };

  return (
    <div className="App">
      <h1>Socket.io Example</h1>
      <button onClick={sendMessageToServer}>Send Message</button>
      {/* Ton contenu */}
    </div>
  );
}

export default App;

// Better archi https://socket.io/how-to/use-with-react