import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { TaskRequest } from '../../shared/model/task-request.model';
import { Task } from '../../shared/model/task.model';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        TaskService,
        { provide: MessageService, useValue: messageServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addTask', () => {
    it('should call addTask and show success message on success', () => {
      const taskRequest: TaskRequest = { label: 'Test Task', complete: false };
      const mockResponse: Task = { id: '1', label: 'Test Task', complete: false };

      service.addTask(taskRequest).subscribe((task) => {
        expect(task).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Ajouté',
        detail: 'Tâche ajoutée avec succès',
      });
    });

    it('should call addTask and show error message on failure', () => {
      const taskRequest: TaskRequest = { label: 'Test Task', complete: false };

      service.addTask(taskRequest).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}`);
      expect(req.request.method).toBe('POST');
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Erreur lors de l’ajout de la tâche',
      });
    });
  });

  describe('loadTasks', () => {
    it('should call loadTasks and return a list of tasks', () => {
      const mockResponse: Task[] = [
        { id: '1', label: 'Task 1', complete: false },
        { id: '2', label: 'Task 2', complete: true },
      ];

      service.loadTasks().subscribe((tasks) => {
        expect(tasks.length).toBe(2);
        expect(tasks).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error when loading tasks', () => {
      service.loadTasks().subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}`);
      expect(req.request.method).toBe('GET');
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Erreur lors de la récupération des tâches',
      });
    });
  });

  describe('loadTasksFiltered', () => {
    it('should call loadTasksFiltered and return filtered tasks', () => {
      const mockResponse: Task[] = [
        { id: '1', label: 'Task 1', complete: false },
        { id: '2', label: 'Task 2', complete: true },
      ];
      const filter = 'status';

      service.loadTasksFiltered(filter).subscribe((tasks) => {
        expect(tasks.length).toBe(2);
        expect(tasks).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}?filter=${filter}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error when loading filtered tasks', () => {
      const filter = 'status';

      service.loadTasksFiltered(filter).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}?filter=${filter}`);
      expect(req.request.method).toBe('GET');
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Erreur lors de la récupération des tâches',
      });
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status and show success message', () => {
      const mockTask: Task = { id: '1', label: 'Test Task', complete: false };

      service.updateTaskStatus(mockTask).subscribe((updatedTask) => {
        expect(updatedTask.complete).toBe(true);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/1/status?complete=true`);
      expect(req.request.method).toBe('PATCH');
      req.flush({ ...mockTask, complete: true });

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'info',
        summary: 'Mise à jour',
        detail: 'Statut mis à jour',
      });
    });

    it('should handle error when updating task status', () => {
      const mockTask: Task = { id: '1', label: 'Test Task', complete: false };

      service.updateTaskStatus(mockTask).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/1/status?complete=true`);
      expect(req.request.method).toBe('PATCH');
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Erreur lors de la mise à jour de la tâche',
      });
    });
  });
});
