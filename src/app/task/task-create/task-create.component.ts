import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);

  public taskForm: FormGroup<TaskRequestForm> = this.fb.group<TaskRequestForm>({
    label: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    complete: new FormControl<boolean>(false, { nonNullable: true }),
  });

  public errorMessage: string | null = null;

  public onTaskAdded = output<TaskRequest>();

  public addTask() {
    this.onTaskAdded.emit(this.taskForm.getRawValue());
    this.taskForm.reset({ label: '', complete: false });
  }
}
