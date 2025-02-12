import { CommonModule } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { TaskService } from '../../core/service/task.service';
import { TASK_FILTERS, TaskFilter, TaskFilterType } from '../../shared/model/task-filter.model';
import { Task } from '../../shared/model/task.model';
import { TaskListFilterComponent } from './component/task-list-filter/task-list-filter.component';
import { TaskForm, TasksForm } from './model/task-list-form.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TaskListFilterComponent,
    TableModule,
    CheckboxModule,
    ButtonModule,
    ToastModule,
    SelectModule,
    TranslateModule,
  ],
})
export class TaskListComponent implements OnInit, OnDestroy {
  private readonly taskService = inject(TaskService);
  private readonly fb = inject(FormBuilder);
  private readonly rxjsSub = new Subscription();

  public tasksForm: FormGroup<TasksForm> = this.fb.group<TasksForm>({
    tasks: this.fb.array<FormGroup<TaskForm>>([]),
  });
  public task = input.required<Task, Task>({
    transform: (task) => this.addTaskToList(task),
  });

  public currentFilter: TaskFilterType = TaskFilterType.ALL;

  ngOnInit(): void {
    this.loadTasks();
  }

  public get tasksArray(): FormArray {
    return this.tasksForm.controls.tasks;
  }

  private loadTasks(): void {
    this.rxjsSub.add(
      this.taskService.loadTasks().subscribe((tasks) => {
        tasks.forEach((task) => {
          this.tasksArray.push(this.createTaskFormGroup(task));
        });
      })
    );
  }

  private loadTasksFiltered(filter: string): void {
    this.rxjsSub.add(
      this.taskService.loadTasksFiltered(filter).subscribe((tasks) => {
        this.tasksArray.clear();
        tasks.forEach((task) => {
          this.tasksArray.push(this.createTaskFormGroup(task));
        });
      })
    );
  }

  private createTaskFormGroup(task: Task): FormGroup<TaskForm> {
    return this.fb.group<TaskForm>({
      id: new FormControl<string>(task.id, { nonNullable: true }),
      label: new FormControl<string>(task.label, { nonNullable: true, validators: [Validators.required] }),
      complete: new FormControl<boolean>(task.complete, { nonNullable: true }),
    });
  }

  public addTaskToList(task: Task): Task {
    if (!this.tasksForm || !this.tasksArray) {
      console.log('coucou');
      return task;
    }
    if (task.id !== '') {
      this.tasksArray.push(this.createTaskFormGroup(task));
      return task;
    }
    return task;
  }

  public toggleTaskStatus(index: number): void {
    const taskControl = this.tasksArray.at(index);
    const updatedTask = { ...taskControl.value, complete: !taskControl.value.complete };
    this.rxjsSub.add(
      this.taskService.updateTaskStatus(updatedTask).subscribe((updatedTask) => {
        taskControl.patchValue({ complete: updatedTask.complete });
        if (this.currentFilter === TaskFilterType.STATUS && updatedTask.complete) {
          this.tasksArray.removeAt(index);
        }
      })
    );
  }

  public deleteTask(index: number): void {
    const taskToDelete = this.tasksArray.at(index).value;
    this.rxjsSub.add(
      this.taskService.deleteTask(taskToDelete.id).subscribe(() => {
        this.tasksArray.removeAt(index);
      })
    );
  }

  public onFilterChange(selectedFilter: TaskFilter): void {
    const filterType: TaskFilterType = this.getFilterTypeFromCode(selectedFilter.code);
    this.currentFilter = filterType;
    const filterCode: string = TASK_FILTERS[filterType].code;
    this.loadTasksFiltered(filterCode);
  }

  private getFilterTypeFromCode(code: string): TaskFilterType {
    return (
      Object.values(TaskFilterType).find((filterType) => TASK_FILTERS[filterType].code === code) || TaskFilterType.ALL
    );
  }

  ngOnDestroy(): void {
    this.rxjsSub.unsubscribe();
  }
}
