import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { TASK_FILTERS, TaskFilter, TaskFilterType } from '../../../../shared/model/task-filter.model';
import { TaskFilterForm } from './model/task-list-filter.model';

@Component({
  selector: 'app-task-list-filter',
  imports: [ReactiveFormsModule, SelectModule, TranslateModule],
  templateUrl: './task-list-filter.component.html',
  styleUrl: './task-list-filter.component.scss',
})
export class TaskListFilterComponent {
  public taskFilterForm: FormGroup<TaskFilterForm>;
  public filters: TaskFilter[] = Object.values(TASK_FILTERS);

  public onFilterChange = output<TaskFilter>();

  constructor() {
    this.taskFilterForm = new FormGroup({
      filter: new FormControl<TaskFilter>(TASK_FILTERS[TaskFilterType.ALL], {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  public onSelectedFilter(): void {
    this.onFilterChange.emit(this.taskFilterForm.getRawValue().filter);
  }
}
