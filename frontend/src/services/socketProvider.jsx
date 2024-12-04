/* eslint-disable react/react-in-jsx-scope */
// import { useEffect, useContext, createContext, useState } from "react";
// import { io } from "socket.io-client";

// const SocketContext = createContext(undefined);

// function SocketProvider({ children }) {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const newSocket = io("http://localhost:5000", {
//       withCredentials: true,
//     });
//     setSocket(newSocket);

//     newSocket.on("connect", () => {
//       console.log("Socket connected:", newSocket.id);
//     });

//     return () => {
//       newSocket.disconnect();
//       console.log("Socket disconnected");
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={{ socket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// }

// export default SocketProvider;

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error("useSocket must be used within a SocketProvider");
//   }
//   return context;
// };


import { useEffect } from "react";
import { useContext } from "react";
import { createContext, useState } from "react";
import { io } from "socket.io-client";

const socketContext = createContext(undefined);

// eslint-disable-next-line react/prop-types
function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) {
      // const newSocket = io("http://localhost:5000");
      const newSocket = io("https://trivandrumscans.online");

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
        setSocket(newSocket);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, [socket]);

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
}

export default SocketProvider;

export const useSocket = () => {
  const context = useContext(socketContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
