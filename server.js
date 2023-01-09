const net = require('net');
const fs = require('fs');

let nextId = 0;

const server = net.createServer((socket) => {
  

  // Assign an ID to the new client
  const id = nextId++;
  console.log('Client '+id+' connected');
  // Add the new client socket to the array of client sockets
  clients[id] = socket;




  // Send a message to all the clients to inform them that a new client has joined
    
  Object.values(clients).forEach((client) => {
    if(client == socket){
        client.write("Your id is "+id)
    }
    else{
        client.write(`[${id}] joined the chat`);
        
    }
    
  });


  // Log the fact that the client has joined
  fs.appendFile('chat.log', `[${id}] joined the chat\n`, (err) => {
    if (err) throw err;
  });

  socket.on('data', (data) => {
    console.log(`ID:${id} ${data}`);
    fs.appendFile('chat.log', `[${id}] ${data}`, (err) => {
        if (err) throw err;
    });
    
    // Iterate through the array of client sockets and write the received message to all the others
    Object.values(clients).forEach((client) => {
        if(client !== socket){
            client.write(`[${id}] ${data}`);
        }
      
    });
  });

  socket.on('close', () => {
    console.log('Client '+id+' disconnected');

    // Remove the disconnected client socket from the array of client sockets
    delete clients[id];

        // Log the fact that the client has left
        fs.appendFile('chat.log', `[${id}] left the chat\n`, (err) => {
            if (err) throw err;
          });

    // Send a message to all the clients to inform them that the client has left
    Object.values(clients).forEach((client) => {
      client.write(`[${id}] left the chat`);

    });
  });
});

// Initialize the array of client sockets
const clients = {};

server.listen(8000, () => {
  console.log('Server listening on port 8000');
});