import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { TaskService } from '../../core/service/task.service';
import { TaskRequest } from '../../shared/task-request.model';

@Component({
  selector: 'app-task-create',
  imports: [CommonModule, ReactiveFormsModule, MessagesModule, MessageModule, ButtonModule],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.scss',
})
export class TaskCreateComponent {
  public taskForm: FormGroup;
  public errorMessage: string | null = null;

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

  public onSubmit() {
    if (this.taskForm.invalid) {
      return;
    }

    const taskRequest: TaskRequest = {
      label: this.taskForm.value.label,
      complete: false,
    };

    this.taskService.createTask(taskRequest).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Tâche ajoutée avec succès !',
        });
        this.taskForm.reset();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: "Erreur lors de l'ajout de la tâche",
        });
      },
    });
  }
}
