import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScreenShareService {
  private mediaStream?: MediaStream;

  async startCapture(): Promise<MediaStream> {
    try {
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: true,
        audio: false,
      });

      this.mediaStream = stream;
      return stream;
    } catch (err) {
      console.error('Ошибка захвата экрана:', err);
      throw err;
    }
  }

  stopCapture() {
    this.mediaStream?.getTracks().forEach((track) => track.stop());
    this.mediaStream = undefined;
  }
}
