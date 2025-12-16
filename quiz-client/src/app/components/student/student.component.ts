import { Component, OnDestroy } from '@angular/core';
import { SocketService } from '../../services/socket/screen-socket.service';
import { ScreenShareService } from '../../services/screen-share.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnDestroy {
  sessionId = "";
  pc!: RTCPeerConnection;
  stream?: MediaStream;
  connected = false;
  teacherSocketId: string = "";
  studentName = "";

  constructor(
    private socket: SocketService,
    private screen: ScreenShareService
  ) {}

  async connectToRoom() {
    if (!this.sessionId.trim()) return;

    this.socket.connect();
    this.socket.joinSession(
      this.sessionId,
      this.studentName,
      "student",
    );

    this.connected = true;

    this.pc = new RTCPeerConnection();

    this.stream = await this.screen.startCapture();
    this.stream.getTracks().forEach(t => {
      this.pc.addTrack(t, this.stream!);
    });

    this.pc.onicecandidate = (e) => {
      if (e.candidate) {
        this.socket.emit("signal", {
          toSocketId: this.teacherSocketId,
          data: { candidate: e.candidate }
        });
      }
    };
    

    // преподаватель посылает offer → студент отвечает
    this.socket.on("signal", async ({ fromSocketId, data }) => {
      if (data.offer) {
        await this.pc.setRemoteDescription(data.offer);

        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);

        this.socket.emit("signal", {
          toSocketId: fromSocketId,
          data: { answer }
        });
      }

      if (data.candidate) {
        await this.pc.addIceCandidate(data.candidate);
      }
    });

    this.socket.once("teacher-info", ({ teacherSocketId }) => {
      this.teacherSocketId = teacherSocketId;
    });

    this.socket.on("participant-joined", ({ socketId, role }) => {
      if (role === "teacher") {
        this.teacherSocketId = socketId;
      }
    });

  }

  ngOnDestroy() {
    this.screen.stopCapture();
  }
}
