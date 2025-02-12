import { FormControl } from '@angular/forms';

export interface TaskRequestForm {
  label: FormControl<string>;
  complete: FormControl<boolean>;
}
