import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
})
export class AppComponent {
  private router = inject(Router);

  constructor() {
    this.initializeApp();
  }

  private initializeApp() {
    App.addListener('backButton', ({ canGoBack }) => {
      const currentUrl = this.router.url;
      if (currentUrl === '/home' || currentUrl === '/') {
        App.exitApp();
      }
    });
  }
}
