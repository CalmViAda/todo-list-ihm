import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TaskRequest } from '../../shared/model/task-request.model';
import { TaskRequestForm } from './model/task-form.model';

@Component({
  selector: 'app-add-task',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, TranslateModule],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.scss',
})
export class TaskCreateComponent {
  public taskForm: FormGroup<TaskRequestForm>;
  public errorMessage: string | null = null;

  public onTaskAdded = output<TaskRequest>();

  private readonly messageService = inject(MessageService);

  constructor() {
    this.taskForm = new FormGroup<TaskRequestForm>({
      label: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      complete: new FormControl<boolean>(false, { nonNullable: true }),
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
    this.onTaskAdded.emit(this.taskForm.getRawValue());
    this.taskForm.reset({ label: '', complete: false });
  }
}
