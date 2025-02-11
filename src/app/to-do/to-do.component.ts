import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TaskService } from '../core/service/task.service';
import { TaskRequest } from '../shared/model/task-request.model';
import { Task } from '../shared/model/task.model';
import { TaskCreateComponent } from '../task/task-create/task-create.component';

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
  ],
  templateUrl: './to-do.component.html',
  styleUrl: './to-do.component.scss',
})
export class ToDoComponent {
  public tasks: Task[] = [];
  public taskForm: FormGroup;

  constructor(
    private readonly taskService: TaskService,
    private readonly messageService: MessageService,
    private readonly formBuilder: FormBuilder
  ) {
    this.taskForm = this.formBuilder.group({
      label: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  public addTask(taskRequest: TaskRequest): void {
    this.taskService.addTask(taskRequest).subscribe((task) => {
      this.tasks.push(task);
    });
  }
}
