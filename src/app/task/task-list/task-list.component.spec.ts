import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { of } from 'rxjs';
import { TaskService } from '../../core/service/task.service';
import { Task } from '../../shared/model/task.model';
import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;
  let messageServiceMock: jasmine.SpyObj<MessageService>;
  let formBuilderSpy: jasmine.SpyObj<FormBuilder>;

  beforeEach(() => {
    taskServiceMock = jasmine.createSpyObj('TaskService', ['loadTasks', 'loadTasksFiltered', 'updateTaskStatus']);
    taskServiceMock.loadTasks.and.returnValue(of([]));
    messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);
    formBuilderSpy = jasmine.createSpyObj('FormBuilder', ['group', 'array']);
    formBuilderSpy.group.and.returnValue(
      new FormGroup({
        label: new FormControl('', [Validators.required, Validators.minLength(3)]),
        complete: new FormControl(false),
      })
    );

    TestBed.configureTestingModule({
      imports: [
        TaskListComponent,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        CheckboxModule,
        TableModule,
        ToastModule,
      ],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        FormBuilder,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    const mockTasks: Task[] = [
      { id: '1', label: 'Task 1', complete: false },
      { id: '2', label: 'Task 2', complete: true },
    ];
    taskServiceMock.loadTasks.and.returnValue(of(mockTasks));

    component.ngOnInit();

    expect(taskServiceMock.loadTasks).toHaveBeenCalled();
    expect(component.tasksArray.length).toBe(2);
    expect(component.tasksArray.at(0).get('label')?.value).toBe('Task 1');
    expect(component.tasksArray.at(1).get('complete')?.value).toBe(true);
  });

  it('should load filtered tasks on filter change', () => {
    const mockFilteredTasks: Task[] = [{ id: '1', label: 'Incomplete Task', complete: false }];
    taskServiceMock.loadTasksFiltered.and.returnValue(of(mockFilteredTasks));

    component.taskFilterForm.controls['filter'].setValue('status');
    component.onFilterChange();

    expect(taskServiceMock.loadTasksFiltered).toHaveBeenCalledWith('status');
    expect(component.tasksArray.length).toBe(1);
    expect(component.tasksArray.at(0).get('label')?.value).toBe('Incomplete Task');
  });

  it('should add task to the list when set task input', () => {
    const newTask: Task = { id: '3', label: 'New Task', complete: false };

    component.task = newTask;

    expect(component.tasksArray.length).toBe(1);
    expect(component.tasksArray.at(0).get('label')?.value).toBe('New Task');
  });

  it('should toggle task status when toggleTaskStatus is called', () => {
    const taskToToggle: Task = { id: '1', label: 'Task 1', complete: false };
    const mockUpdatedTask: Task = { id: '1', label: 'Task 1', complete: true };

    component.tasksArray.push(component['createTaskFormGroup'](taskToToggle));

    taskServiceMock.updateTaskStatus.and.returnValue(of(mockUpdatedTask));

    component.toggleTaskStatus(0);

    expect(taskServiceMock.updateTaskStatus).toHaveBeenCalledWith(mockUpdatedTask);
    expect(component.tasksArray.at(0).get('complete')?.value).toBe(true);
  });
});
