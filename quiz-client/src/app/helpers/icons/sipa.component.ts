import { Component } from "@angular/core";

@Component({
    selector: 'app-sipa-icon',
    template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 0 260 290" width="110" height="200" role="img" aria-label="Милый анимированный цыплёнок с крылышками (разнесённые)">
  <!-- тело -->
  <path d="M100 40 
           C140 40, 170 90, 170 130
           C170 180, 140 210, 100 210
           C60 210, 30 180, 30 130
           C30 90, 60 40, 100 40 Z"
        fill="#FFD500"
        stroke="#000"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-dasharray="420 20"
        stroke-dashoffset="15"/>

  <!-- левое крыло (сдвинуто левее, не увеличено) -->
  <g id="wing-left">
    <path d="M10 120 
             C-10 115, -15 95, 15 90
             C30 88, 45 95, 50 110
             C45 118, 30 122, 10 120 Z"
          fill="#FFD500"
          stroke="#000"
          stroke-width="3.5"
          stroke-linecap="round"
          stroke-linejoin="round"/>
    <animateTransform attributeName="transform" type="rotate"
      values="0 40 115; -20 40 115; 0 40 115"
      dur="1.3s" repeatCount="indefinite"/>
  </g>

  <!-- правое крыло (сдвинуто правее, не увеличено) -->
  <g id="wing-right">
    <path d="M190 120 
             C210 115, 215 95, 185 90
             C170 88, 155 95, 150 110
             C155 118, 170 122, 190 120 Z"
          fill="#FFD500"
          stroke="#000"
          stroke-width="3.5"
          stroke-linecap="round"
          stroke-linejoin="round"/>
    <animateTransform attributeName="transform" type="rotate"
      values="0 160 115; 20 160 115; 0 160 115"
      dur="1.3s" repeatCount="indefinite"/>
  </g>

  <!-- милые глаза -->
  <g id="cute-eyes">
    <circle cx="80" cy="95" r="10" fill="white" stroke="black" stroke-width="2.5"/>
    <circle cx="120" cy="95" r="10" fill="white" stroke="black" stroke-width="2.5"/>
    <circle cx="80" cy="95" r="4" fill="black"/>
    <circle cx="120" cy="95" r="4" fill="black"/>
    <circle cx="78" cy="93" r="1.8" fill="white"/>
    <circle cx="118" cy="93" r="1.8" fill="white"/>
  </g>

  <!-- клюв -->
  <polygon points="100,110 90,120 110,120" fill="#FF9500" stroke="black" stroke-width="1.8"/>

  <!-- лапки-трезубцы -->
  <g stroke="black" stroke-width="3.5" stroke-linecap="round">
    <path d="M80 185 L80 210" />
    <path d="M80 210 L70 225" />
    <path d="M80 210 L80 225" />
    <path d="M80 210 L90 225" />
    <path d="M120 185 L120 210" />
    <path d="M120 210 L110 225" />
    <path d="M120 210 L120 225" />
    <path d="M120 210 L130 225" />
  </g>

  <!-- перышки сверху -->
  <g stroke="black" stroke-width="2.5" stroke-linecap="round">
    <path d="M95 45 L90 35" />
    <path d="M100 45 L100 33" />
    <path d="M105 45 L110 35" />
  </g>
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