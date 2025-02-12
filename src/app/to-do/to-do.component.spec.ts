import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { TaskService } from '../core/service/task.service';
import { TaskRequest } from '../shared/model/task-request.model';
import { Task } from '../shared/model/task.model';
import { TaskCreateComponent } from '../task/task-create/task-create.component';
import { MockTaskCreateComponent } from '../task/task-create/task-create.component.mock.spec';
import { TaskListComponent } from '../task/task-list/task-list.component';
import { MockTaskListComponent } from '../task/task-list/task-list.component.mock.spec';
import { ToDoComponent } from './to-do.component';

describe('ToDoComponent', () => {
  let component: ToDoComponent;
  let fixture: ComponentFixture<ToDoComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['addTask']);
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      imports: [ToDoComponent, ReactiveFormsModule],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
      ],
    })
      .overrideComponent(ToDoComponent, {
        remove: { imports: [TaskListComponent, TaskCreateComponent] },
        add: { imports: [MockTaskListComponent, MockTaskCreateComponent] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new task when addTask is called', () => {
    const taskRequest: TaskRequest = { label: 'Test Task', complete: false };
    const newTask: Task = { id: '1', label: 'Test Task', complete: false };

    taskServiceSpy.addTask.and.returnValue(of(newTask));

    component.addTask(taskRequest);

    expect(taskServiceSpy.addTask).toHaveBeenCalledWith(taskRequest);

    expect(component.tasks.length).toBe(1);
    expect(component.tasks[0].label).toBe('Test Task');
    expect(component.newTask.label).toBe('Test Task');
  });

  it('should call taskService.addTask with the correct parameters', () => {
    const taskRequest: TaskRequest = { label: 'Another Task', complete: false };
    const newTask: Task = { id: '2', label: 'Another Task', complete: false };

    taskServiceSpy.addTask.and.returnValue(of(newTask));

    component.addTask(taskRequest);

    expect(taskServiceSpy.addTask).toHaveBeenCalledWith(taskRequest);
    expect(component.tasks).toContain(newTask);
  });
});
