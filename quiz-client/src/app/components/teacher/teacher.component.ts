import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../services/socket/screen-socket.service';

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit, OnDestroy {
  sessionId = "";
  sessionCreated = false;
  teacherName: string = 'Teacher';

  peers: Record<string, RTCPeerConnection> = {};
    studentStreams: { 
    id: string, 
    name: string,
    stream: MediaStream 
  }[] = [];

  studentsList: { id: string, name: string }[] = [];

  constructor(private socket: SocketService) {}

  ngOnInit() {
  this.socket.connect();

  // ==== SIGNAL (answer, candidate) ====
  this.socket.on("signal", async ({ fromSocketId, data }) => {
    const pc = this.peers[fromSocketId];
    if (!pc) return;

    if (data.answer) {
      await pc.setRemoteDescription(data.answer);
    }

    if (data.candidate) {
      await pc.addIceCandidate(data.candidate);
    }
  });

  // ==== НОВЫЙ СТУДЕНТ ====
  // this.socket.on("participant-joined", ({ socketId, role, name }) => {
  //   if (role !== "student") return;

  //   // обновляем список студентов
  //   this.studentsList.push({ id: socketId, name });

  //   // создаём WebRTC
  //   const pc = new RTCPeerConnection();
  //   this.peers[socketId] = pc;

  //   pc.ontrack = (event) => {
  //     this.studentStreams.push({
  //       id: socketId,
  //       name,
  //       stream: event.streams[0]
  //     });
  //   };

  //   pc.onicecandidate = (e) => {
  //     if (e.candidate) {
  //       this.socket.emit("signal", {
  //         toSocketId: socketId,
  //         data: { candidate: e.candidate }
  //       });
  //     }
  //   };

  //   pc.createOffer().then((offer) => {
  //     pc.setLocalDescription(offer);
  //     this.socket.emit("signal", {
  //       toSocketId: socketId,
  //       data: { offer }
  //     });
  //   });
  // });

  // STUDENT READY → CREATE OFFER
    this.socket.on("student-ready", async ({ socketId }) => {
      const pc = this.createPeer(socketId);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      this.socket.emit("signal", {
        toSocketId: socketId,
        data: { offer }
      });
    });

  // ==== ОБНОВЛЕНИЕ СПИСКА СТУДЕНТОВ ====
  this.socket.on("students-list", (list) => {
    this.studentsList = list;
  });
}

createPeer(socketId: string): RTCPeerConnection {
    if (this.peers[socketId]) return this.peers[socketId];

    const pc = new RTCPeerConnection(RTC_CONFIG);
    this.peers[socketId] = pc;

    pc.ontrack = (e) => {
      this.studentStreams.push({
        id: socketId,
        name: 'Student',
        stream: e.streams[0]
      });
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        this.socket.emit("signal", {
          toSocketId: socketId,
          data: { candidate: e.candidate }
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('Teacher ICE:', pc.iceConnectionState);
    };

    return pc;
  }


  createRoom() {
    this.socket.createSession(({ sessionId }) => {
      this.sessionCreated = true;
      this.sessionId = sessionId;

      this.socket.joinSession(sessionId, this.teacherName, "teacher");
    });
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }
}
