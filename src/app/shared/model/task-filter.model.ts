export enum TaskFilterType {
  ALL = 'all',
  STATUS = 'status',
}

export interface TaskFilter {
  code: string;
  label: string;
}

export const TASK_FILTERS: Record<TaskFilterType, TaskFilter> = {
  [TaskFilterType.ALL]: { code: 'all', label: 'Toutes les tâches' },
  [TaskFilterType.STATUS]: { code: 'status', label: 'Tâches incomplètes' },
};
