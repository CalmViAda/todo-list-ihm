import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { TaskService } from '../../core/service/task.service';
import { TaskRequest } from '../../shared/model/task-request.model';
import { TaskCreateComponent } from './task-create.component';

describe('TaskCreateComponent', () => {
  let component: TaskCreateComponent;
  let fixture: ComponentFixture<TaskCreateComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['addTask']);
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TaskCreateComponent, TranslateModule.forRoot()],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TaskCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit taskAdded event when form is valid and task is added', () => {
    const taskRequest: TaskRequest = { label: 'New Task', complete: false };
    const emitSpy = spyOn(component.onTaskAdded, 'emit');

    component.taskForm.setValue(taskRequest);

    component.addTask();

    expect(emitSpy).toHaveBeenCalledWith(taskRequest);

    expect(component.taskForm.value).toEqual({ label: '', complete: false });
  });

  it('should disabled button if the form is invalid and a task is not added', () => {
    component.taskForm.setValue({ label: 'a', complete: false });

    component.addTask();

    const elem = fixture.debugElement.query(By.css('#submit-btn > button'));
    const button = elem.nativeElement as HTMLButtonElement;
    expect(button.disabled).toEqual(true);
    expect(component.taskForm.invalid).toBeTrue();
  });

  it('should not call taskService.addTask if form is invalid', () => {
    component.taskForm.setValue({ label: 'a', complete: false });

    component.addTask();

    expect(taskServiceSpy.addTask).not.toHaveBeenCalled();
  });

  it('should reset form after emitting task', () => {
    const taskRequest: TaskRequest = { label: 'Test Task', complete: false };

    component.taskForm.setValue(taskRequest);

    component.addTask();

    expect(component.taskForm.value).toEqual({ label: '', complete: false });
  });
});
