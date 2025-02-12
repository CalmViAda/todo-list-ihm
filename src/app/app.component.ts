import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from './core/header/header.component';

@Component({
  selector: 'app-root',
  imports: [ToastModule, HeaderComponent, RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private translate = inject(TranslateService);

  constructor() {
    this.translate.addLangs(['fr', 'en']);
    this.translate.setDefaultLang('en');
    this.translate.use('fr');
  }
}
