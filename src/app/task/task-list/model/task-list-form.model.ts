import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface TaskFilterForm {
  filter: FormControl<string>;
}

export interface TasksForm {
  tasks: FormArray<FormGroup<TaskForm>>;
}

export interface TaskForm {
  id: FormControl<string>;
  label: FormControl<string>;
  complete: FormControl<boolean>;
}
