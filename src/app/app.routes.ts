import { Routes } from '@angular/router';
import { ToDoComponent } from './to-do/to-do.component';

export const routes: Routes = [
  { path: '', redirectTo: '/to-do', pathMatch: 'full' },
  { path: 'to-do', component: ToDoComponent },
];
