import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TaskService } from '../core/service/task.service';
import { TaskRequest } from '../shared/model/task-request.model';
import { Task } from '../shared/model/task.model';
import { TaskCreateComponent } from '../task/task-create/task-create.component';
import { TaskListComponent } from '../task/task-list/task-list.component';
import { TaskForm } from './model/to-do-form.model';

@Component({
  selector: 'app-to-do',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    ToastModule,
    TaskCreateComponent,
    TaskListComponent,
  ],
  templateUrl: './to-do.component.html',
})
export class ToDoComponent {
  public tasks: Task[] = [];
  public taskForm: FormGroup<TaskForm>;
  public newTask: Task;

  constructor(private readonly taskService: TaskService) {
    this.newTask = { id: '', label: '', complete: false };
    this.taskForm = new FormGroup<TaskForm>({
      label: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      complete: new FormControl<boolean>(false, { nonNullable: true }),
    });
  }

  public addTask(taskRequest: TaskRequest): void {
    this.taskService.addTask(taskRequest).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.newTask = task;
      },
    });
  }
}
