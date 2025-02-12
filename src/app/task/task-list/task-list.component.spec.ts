import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { TaskService } from '../../core/service/task.service';
import { TASK_FILTERS, TaskFilter, TaskFilterType } from '../../shared/model/task-filter.model';
import { Task } from '../../shared/model/task.model';
import { TaskListFilterComponent } from './component/task-list-filter/task-list-filter.component';
import { MockTaskListFilterComponent } from './component/task-list-filter/task-list-filter.component.mock.spec';
import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let componentRef: ComponentRef<TaskListComponent>;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  const mockTasks: Task[] = [
    { id: '1', label: 'Task 1', complete: false },
    { id: '2', label: 'Task 2', complete: true },
    { id: '3', label: 'Task 3', complete: false },
  ];

  beforeEach(() => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'loadTasks',
      'loadTasksFiltered',
      'updateTaskStatus',
      'deleteTask',
    ]);

    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      imports: [TaskListComponent, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
      ],
    })
      .overrideComponent(TaskListComponent, {
        remove: {
          imports: [TaskListFilterComponent],
        },
        add: {
          imports: [MockTaskListFilterComponent],
        },
      })
      .compileComponents();
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    taskServiceSpy.loadTasks.and.returnValue(of(mockTasks));

    component.ngOnInit();

    expect(taskServiceSpy.loadTasks).toHaveBeenCalled();
    expect(component.tasksArray.length).toBe(mockTasks.length);
  });

  it('should add tasks to the form array when loaded', () => {
    componentRef.setInput('task', { id: '', label: '', complete: false });
    taskServiceSpy.loadTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges();

    expect(component.tasksArray.length).toBe(mockTasks.length);
    expect(component.tasksArray.at(0).value.label).toBe('Task 1');
  });

  it('should load tasks filtered by filter code', () => {
    const filterCode = 'status';
    taskServiceSpy.loadTasksFiltered.and.returnValue(of(mockTasks.filter((task) => !task.complete)));

    component.onFilterChange({ code: 'status', label: 'Tâches incompletes' });

    expect(taskServiceSpy.loadTasksFiltered).toHaveBeenCalledWith(filterCode);
    expect(component.tasksArray.length).toBe(2);
    expect(component.tasksArray.at(0).value.label).toBe('Task 1');
  });

  it('should delete task from list', () => {
    taskServiceSpy.deleteTask.and.returnValue(of(void 0));

    const taskFormGroup = new FormGroup({
      id: new FormControl<string>(mockTasks[0].id, { nonNullable: true }),
      label: new FormControl<string>(mockTasks[0].label, { nonNullable: true, validators: [Validators.required] }),
      complete: new FormControl<boolean>(mockTasks[0].complete, { nonNullable: true }),
    });
    component.tasksArray.push(taskFormGroup);
    component.deleteTask(0);

    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith(mockTasks[0].id);
    expect(component.tasksArray.length).toBe(0);
  });

  it('should handle filter change and load tasks filtered by the selected filter', () => {
    const selectedFilter: TaskFilter = TASK_FILTERS[TaskFilterType.STATUS];
    taskServiceSpy.loadTasksFiltered.and.returnValue(of(mockTasks.filter((task) => !task.complete)));

    component.onFilterChange(selectedFilter);

    expect(component.currentFilter).toBe(TaskFilterType.STATUS);
    expect(taskServiceSpy.loadTasksFiltered).toHaveBeenCalledWith(selectedFilter.code);
    expect(component.tasksArray.length).toBe(2);
  });

  it('should not remove task if filter type is not STATUS after toggle', () => {
    componentRef.setInput('task', { id: '', label: '', complete: false });
    taskServiceSpy.loadTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges();
    component.currentFilter = TaskFilterType.ALL;
    expect(component.tasksArray.length).toBe(3);

    const taskToToggle = { ...mockTasks[0], complete: false };
    taskServiceSpy.updateTaskStatus.and.returnValue(of({ ...taskToToggle, complete: true }));

    component.toggleTaskStatus(0);

    expect(taskServiceSpy.updateTaskStatus).toHaveBeenCalledWith({ ...mockTasks[0], complete: true });
    expect(component.tasksArray.length).toBe(3);
  });

  it('should remove task if filter type is STATUS after toggle', () => {
    component.currentFilter = TaskFilterType.STATUS;
    taskServiceSpy.loadTasksFiltered.and.returnValue(of(mockTasks.filter((task) => !task.complete)));

    component.onFilterChange({ code: 'status', label: 'Tâches incompletes' });

    expect(component.tasksArray.length).toBe(2);
    expect(component.currentFilter).toBe(TaskFilterType.STATUS);

    const taskToToggle = { ...mockTasks[0], complete: false };
    taskServiceSpy.updateTaskStatus.and.returnValue(of({ ...taskToToggle, complete: true }));

    component.toggleTaskStatus(0);

    expect(taskServiceSpy.updateTaskStatus).toHaveBeenCalledWith({ id: '1', label: 'Task 1', complete: true });
    expect(component.tasksArray.length).toBe(1);
  });

  it('should add task to list when a task is added', () => {
    const newTask: Task = { id: '4', label: 'Task 4', complete: false };
    componentRef.setInput('task', newTask);
    taskServiceSpy.loadTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges();

    expect(component.tasksArray.length).toBe(4);
    expect(component.tasksArray.at(0).value.label).toBe('Task 4');
  });
});
