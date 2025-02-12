import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
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
export class ToDoComponent implements OnDestroy {
  private readonly taskService = inject(TaskService);
  private readonly fb = inject(FormBuilder);
  private readonly rxjsSub = new Subscription();

  public newTask: Task = { id: '', label: '', complete: false };

  public taskForm: FormGroup<TaskForm> = this.fb.group<TaskForm>({
    label: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    complete: new FormControl<boolean>(false, { nonNullable: true }),
  });

  constructor() {
    this.taskForm = new FormGroup<TaskForm>({
      label: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      complete: new FormControl<boolean>(false, { nonNullable: true }),
    });
  }

  public addTask(taskRequest: TaskRequest): void {
    this.rxjsSub.add(
      this.taskService.addTask(taskRequest).subscribe({
        next: (task) => {
          this.newTask = task;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.rxjsSub.unsubscribe();
  }
}
