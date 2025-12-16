// socketMiddleware.js (file logging version)
import fs from 'fs';
import path from 'path';

const LOG_PATH = path.join(process.cwd(), 'socket-log.txt');

function logToFile(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(LOG_PATH, line, 'utf8');
}

const sessions = {};

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    logToFile(`Socket connected: ${socket.id}`);

    // Память в рантайме вместо БД
    // let sessions = {}; 
    // sessions = { sessionId: { teacher: socketId, students: {socketId: userId} } }

    // ---------------------------
    // 1) TEACHER CREATES SESSION
    // ---------------------------
    socket.on("create-session", ({ title } = {}, cb) => {
      const sessionId = Math.random().toString(36).substring(2, 8);

      sessions[sessionId] = {
        teacher: socket.id,
        students: {}
      };
      console.log(`Session created: ${sessionId} by ${socket.id}`)
      socket.join(sessionId);
      logToFile(`Session created: ${sessionId} by ${socket.id}`);

      if (cb) cb({ ok: true, sessionId });

      socket.emit("session-created", { sessionId });
    });

    // ---------------------------
    // 2) STUDENT OR TEACHER JOINS
    // ---------------------------
    socket.on("join-session", ({ sessionId, role, userId, name  } = {}, cb) => {
      if (!sessions[sessionId]) {
        logToFile(`JOIN FAILED: session ${sessionId} not found`);
        if (cb) cb({ ok: false, error: "Session not found" });
        return;
      }

      socket.join(sessionId);

      if (role === "student") {
        // sessions[sessionId].students[socket.id] = userId || socket.id;
        io.to(socket.id).emit("teacher-info", {
          teacherSocketId: sessions[sessionId].teacher
        });
      }

      logToFile(`Socket ${socket.id} joined session ${sessionId} as ${role}`);

      io.to(sessionId).emit("participant-joined", {
        socketId: socket.id,
        role,
        name,
        userId
      });

      if (cb) cb({ ok: true });
    });

    // =========================
    // STUDENT READY
    // =========================
    socket.on("student-ready", ({ sessionId }) => {
      const teacherId = sessions[sessionId]?.teacher;
      if (!teacherId) return;

      io.to(teacherId).emit("student-ready", {
        socketId: socket.id
      });
    });

    // ---------------------------
    // 3) WebRTC SIGNAL RELAY
    // ---------------------------
    socket.on("signal", ({ toSocketId, data }) => {
      logToFile(`SIGNAL from ${socket.id} → ${toSocketId}`);
      io.to(toSocketId).emit("signal", { fromSocketId: socket.id, data });
    });

    // ---------------------------
    // 4) Leave session
    // ---------------------------
    socket.on("leave-session", ({ sessionId } = {}) => {
      socket.leave(sessionId);

      logToFile(`Socket ${socket.id} left session ${sessionId}`);

      io.to(sessionId).emit("participant-left", {
        socketId: socket.id
      });
    });

    // ---------------------------
    // 5) Disconnect cleanup
    // ---------------------------
    socket.on("disconnect", () => {
      logToFile(`Socket disconnected: ${socket.id}`);

      for (const sessionId in sessions) {
        if (sessions[sessionId].teacher === socket.id) {
          logToFile(`Teacher disconnected for session ${sessionId}`);
          delete sessions[sessionId];
        } else if (sessions[sessionId].students[socket.id]) {
          delete sessions[sessionId].students[socket.id];
          io.to(sessionId).emit("participant-left", { socketId: socket.id });
        }
      }
    });
  });
}
