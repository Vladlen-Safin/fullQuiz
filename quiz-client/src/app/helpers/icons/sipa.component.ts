import { Component } from "@angular/core";

@Component({
    selector: 'app-sipa-icon',
    template: `
      <svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <!-- Тело -->
  <rect x="8" y="16" width="16" height="8" fill="#FFFFFF"/> <!-- тёмный корпус -->

  <!-- Лапки -->
  <rect x="10" y="24" width="3" height="2" fill="#FFFFFF"/>
  <rect x="19" y="24" width="3" height="2" fill="#FFFFFF"/>

  <!-- Голова -->
  <rect x="10" y="8" width="12" height="8" fill="#FFFFFF"/>

  <!-- Уши цвета тела -->
  <rect x="10" y="6" width="4" height="2" fill="#FFFFFF"/>
  <rect x="18" y="6" width="4" height="2" fill="#FFFFFF"/>

  <!-- Глаза с подмигиванием -->
  <rect x="12" y="10" width="2" height="2" fill="#00FFFF">
    <animate attributeName="fill" values="#00FFFF;#1A1A2E;#00FFFF" dur="1s" repeatCount="indefinite"/>
  </rect>
  <rect x="18" y="10" width="2" height="2" fill="#00FFFF">
    <animate attributeName="fill" values="#00FFFF;#1A1A2E;#00FFFF" dur="1s" repeatCount="indefinite"/>
  </rect>

  <!-- Носик белый -->
  <rect x="15" y="12" width="2" height="1" fill="#000000"/>

  <!-- Щёчки -->
  <rect x="11" y="12" width="1" height="1" fill="#FF55FF"/>
  <rect x="20" y="12" width="1" height="1" fill="#FF55FF"/>

  <!-- Усы -->
  <rect x="9" y="12" width="2" height="0.5" fill="#00FFFF"/>
  <rect x="9" y="13" width="2" height="0.5" fill="#00FFFF"/>
  <rect x="9" y="14" width="2" height="0.5" fill="#00FFFF"/>
  <rect x="21" y="12" width="2" height="0.5" fill="#00FFFF"/>
  <rect x="21" y="13" width="2" height="0.5" fill="#00FFFF"/>
  <rect x="21" y="14" width="2" height="0.5" fill="#00FFFF"/>

  <!-- Хвост в форме буквы "Г" перевёрнутый, сдвинут вправо -->
  <g transform="scale(1,-1) translate(2,-40)">
    <rect x="22" y="18" width="2" height="6" fill="#FF00FF"/>
    <rect x="22" y="22" width="4" height="2" fill="#FF00FF"/>
  </g>

  <!-- Неоновые полоски на теле с мерцанием -->
  <rect x="10" y="18" width="12" height="1" fill="#00FFFF">
    <animate attributeName="fill" values="#00FFFF;#00FFAA;#00FFFF" dur="1s" repeatCount="indefinite"/>
  </rect>
  <rect x="10" y="20" width="12" height="1" fill="#FF00FF">
    <animate attributeName="fill" values="#FF00FF;#FF55FF;#FF00FF" dur="1s" repeatCount="indefinite"/>
  </rect>
</svg>

    `,
    styles: [
        `
          :host {
            display: flex;
          }
        `,
      ],
    standalone: true,
})
export class SipaIconComponent {}