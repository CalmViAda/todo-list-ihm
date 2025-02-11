import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TaskService } from '../../core/service/task.service';
import { Task } from '../../shared/model/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, TableModule, CheckboxModule, ToastModule],
})
export class TaskListComponent implements OnInit {
  @Input()
  public set task(task: Task) {
    if (task.id !== '') {
      this.addTaskToList(task);
    }
  }
  public taskFilterForm: FormGroup;
  public tasksForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly taskService: TaskService
  ) {
    this.taskFilterForm = this.fb.group({
      filter: ['all', Validators.required],
    });
    this.tasksForm = this.fb.group({
      tasks: this.fb.array([]),
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
    this.tasksArray.clear();
    this.taskService.loadTasksFiltered(filter).subscribe((tasks) => {
      tasks.forEach((task) => {
        this.tasksArray.push(this.createTaskFormGroup(task));
      });
    });
  }

  private createTaskFormGroup(task: Task): FormGroup {
    return this.fb.group({
      id: [task.id],
      label: [task.label, Validators.required],
      complete: [task.complete],
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
    });
  }

  onFilterChange() {
    const filter = this.taskFilterForm.get('filter')?.value;
    this.loadTasksFiltered(filter);
  }
}
