import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskRequest } from '../../shared/task-request.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `http://localhost:8080/api/task`;

  constructor(private http: HttpClient) {}

  public createTask(task: TaskRequest): Observable<TaskRequest> {
    return this.http.post<TaskRequest>(this.apiUrl, task);
  }
}
