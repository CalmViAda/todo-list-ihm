import { FormControl } from '@angular/forms';
import { TaskFilter } from '../../../../../shared/model/task-filter.model';

export interface TaskFilterForm {
  filter: FormControl<TaskFilter>;
}
