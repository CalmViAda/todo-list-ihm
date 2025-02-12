import { CommonModule } from '@angular/common';
import { Component, effect, input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
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
export class TaskListComponent implements OnInit {
  public task = input.required<Task>();
  public tasksForm: FormGroup<TasksForm>;
  public currentFilter: TaskFilterType = TaskFilterType.ALL;

  constructor(private readonly taskService: TaskService) {
    this.tasksForm = new FormGroup({
      tasks: new FormArray<FormGroup<TaskForm>>([]),
    });
    effect(() => {
      if (this.task().id !== '') {
        this.addTaskToList(this.task());
      }
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  public get tasksArray(): FormArray {
    return this.tasksForm.get('tasks') as FormArray;
  }

  private loadTasks(): void {
    this.taskService.loadTasks().subscribe((tasks) => {
      tasks.forEach((task) => {
        this.tasksArray.push(this.createTaskFormGroup(task));
      });
    });
  }

  private loadTasksFiltered(filter: string): void {
    this.taskService.loadTasksFiltered(filter).subscribe((tasks) => {
      this.tasksArray.clear();
      tasks.forEach((task) => {
        this.tasksArray.push(this.createTaskFormGroup(task));
      });
    });
  }

  private createTaskFormGroup(task: Task): FormGroup {
    return new FormGroup<TaskForm>({
      id: new FormControl<string>(task.id, { nonNullable: true }),
      label: new FormControl<string>(task.label, { nonNullable: true, validators: [Validators.required] }),
      complete: new FormControl<boolean>(task.complete, { nonNullable: true }),
    });
  }

  public addTaskToList(task: Task): void {
    this.tasksArray.push(this.createTaskFormGroup(task));
  }

  public toggleTaskStatus(index: number): void {
    const taskControl = this.tasksArray.at(index);
    const updatedTask = { ...taskControl.value, complete: !taskControl.value.complete };
    this.taskService.updateTaskStatus(updatedTask).subscribe((updatedTask) => {
      taskControl.patchValue({ complete: updatedTask.complete });
      if (this.currentFilter === TaskFilterType.STATUS && updatedTask.complete) {
        this.tasksArray.removeAt(index);
      }
    });
  }

  public deleteTask(index: number): void {
    const taskToDelete = this.tasksArray.at(index).value;
    this.taskService.deleteTask(taskToDelete.id).subscribe(() => {
      this.tasksArray.removeAt(index);
    });
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
}
