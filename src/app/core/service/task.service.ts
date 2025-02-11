import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TaskRequest } from '../../shared/model/task-request.model';
import { Task } from '../../shared/model/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly messageService: MessageService
  ) {}

  public addTask(task: TaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap(() =>
        this.messageService.add({ severity: 'success', summary: 'Ajouté', detail: 'Tâche ajoutée avec succès' })
      ),
      catchError((error) => {
        this.messageService.add({ severity: 'error', summary: 'Échec', detail: 'Erreur lors de l’ajout de la tâche' });
        return throwError(() => error);
      })
    );
  }
}
