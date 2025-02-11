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
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de l’ajout de la tâche' });
        return throwError(() => error);
      })
    );
  }

  public loadTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de la récupération des tâches',
        });
        return throwError(() => error);
      })
    );
  }

  public loadTasksFiltered(filter: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}?filter=${filter}`).pipe(
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de la récupération des tâches',
        });
        return throwError(() => error);
      })
    );
  }

  public updateTaskStatus(task: Task) {
    return this.http.patch<Task>(`${this.apiUrl}/${task.id}/status?complete=${!task.complete}`, {}).pipe(
      tap(() => this.messageService.add({ severity: 'info', summary: 'Mise à jour', detail: 'Statut mis à jour' })),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de la mise à jour de la tâche',
        });
        return throwError(() => error);
      })
    );
  }
}
