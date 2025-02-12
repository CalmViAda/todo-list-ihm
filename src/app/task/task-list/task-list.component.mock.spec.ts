import { Component, input } from '@angular/core';
import { Task } from '../../shared/model/task.model';

@Component({
  selector: 'app-task-list',
  template: '<p>Voici le composant task list</p>',
})
export class MockTaskListComponent {
  public task = input.required<Task>();
}
