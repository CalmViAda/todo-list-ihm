import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService: MessageService = inject(MessageService);
  return next(req).pipe(
    catchError((err) => {
      messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: err.message,
      });
      console.error('ERROR', err);
      return throwError(() => new Error(err));
    })
  );
};
