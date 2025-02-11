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
      summary: 'Échec',
      detail: 'Erreur lors de l’ajout de la tâche',
    });
  });

  it('should call catchError and show error message if request fails', () => {
    const taskRequest: TaskRequest = { label: 'Test Task', complete: false };

    service.addTask(taskRequest).subscribe({
      next: () => fail('expected an error, not tasks'),
      error: (error) => {
        expect(error).toBeTruthy();
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}`);
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Échec',
      detail: 'Erreur lors de l’ajout de la tâche',
    });
  });
});
