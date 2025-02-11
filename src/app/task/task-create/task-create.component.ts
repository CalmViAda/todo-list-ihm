import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TaskService } from '../../core/service/task.service';
import { TaskRequest } from '../../shared/model/task-request.model';

@Component({
  selector: 'app-add-task',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.scss',
})
export class TaskCreateComponent {
  public taskForm: FormGroup;
  public errorMessage: string | null = null;

  @Output() taskAdded = new EventEmitter<TaskRequest>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly taskService: TaskService,
    private messageService: MessageService
  ) {
    this.taskForm = this.fb.group({
      label: ['', [Validators.required, Validators.minLength(3)]],
      complete: [false],
    });
  }

  public addTask() {
    if (this.taskForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Erreur',
        detail: 'Le libellé doit contenir au moins 3 caractères',
      });
      return;
    }
    this.taskAdded.emit(this.taskForm.value);
    this.taskForm.reset({ label: '', complete: false });
  }
}
