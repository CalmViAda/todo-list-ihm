import { Routes } from '@angular/router';
import { TaskCreateComponent } from './task/task-create/task-create.component';

export const routes: Routes = [
  { path: '', redirectTo: '/task-create', pathMatch: 'full' },
  { path: 'task-create', component: TaskCreateComponent },
];
