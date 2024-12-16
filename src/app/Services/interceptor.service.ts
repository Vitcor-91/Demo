import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Injectable, Type, inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SesionService } from './sesion.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(SesionService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const token = authService.obtenerItemStorageToken('Token');
  let authReq = req;
  if (token != null) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';
      if (error.status == 401) {
        snackBar.open('Finalizo la sesión', 'Cerrar');
        authService.limpiarStorage();
        router.navigate(['']);
        window.location.reload();
      } else {
        errorMessage = `Error code: ${error.status}, message: ${error.message}`;
      }
      return throwError(() => errorMessage);
    })
  );
};
