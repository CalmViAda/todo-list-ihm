import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { TaskFilter } from '../../../../shared/model/task-filter.model';
import { TaskListFilterComponent } from './task-list-filter.component';

describe('TaskListFilterComponent', () => {
  let component: TaskListFilterComponent;
  let fixture: ComponentFixture<TaskListFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskListFilterComponent, ReactiveFormsModule, SelectModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load filters into the form', () => {
    const filters = component.filters;
    const filterControl = component.taskFilterForm.get('filter');

    expect(filters).toBeTruthy();
    expect(filters.length).toBeGreaterThan(0);
    expect(filterControl?.value).toEqual(filters[0]);
  });

  it('should emit filter change when valid filter is selected', () => {
    const filter: TaskFilter = component.filters[1];
    const emitSpy = spyOn(component.onFilterChange, 'emit');

    component.taskFilterForm.setValue({ filter });
    component.onSelectedFilter();

    expect(emitSpy).toHaveBeenCalledWith(filter);
  });

  it('should emit filter change when filter is changed', () => {
    const filter: TaskFilter = component.filters[1];
    const emitSpy = spyOn(component.onFilterChange, 'emit');

    component.taskFilterForm.setValue({ filter });
    component.onSelectedFilter();

    expect(emitSpy).toHaveBeenCalledWith(filter);
  });

  it('should handle filter change without errors', () => {
    const validFilter: TaskFilter = component.filters[0];
    const emitSpy = spyOn(component.onFilterChange, 'emit');

    component.taskFilterForm.setValue({ filter: validFilter });
    component.onSelectedFilter();

    expect(emitSpy).toHaveBeenCalledWith(validFilter);
  });
});
