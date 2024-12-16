import { Injectable } from '@angular/core';
import { LoaderComponent } from '../Views/shared/loader/loader.component';
import {
  MatDialog
} from '@angular/material/dialog';
import { SesionService } from './sesion.service';
import { DialogComponent } from '../Views/shared/dialog/dialog.component';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ConvertsService } from './converts.service';
import { ApiServiceService } from './api-service.service';

@Injectable({
  providedIn: 'root'
})
export class ShowComponentService {
  //dialog: any;
  isBusy: boolean = false;
  response: any;
  Usuario: any;

  constructor(private dialog: MatDialog, private sesion: SesionService, private router: Router,
    private snackBar: MatSnackBar, private convert: ConvertsService
  ) { 
    this.Usuario = this.convert.getValueStringParams( this.sesion.obtenerItemStorage("User") );
  }

  async showLoader(isBusy: boolean)
  {
    if(isBusy)
    {
      this.dialog.open(LoaderComponent);  
    } else {
      if(this.dialog != null)
      {
        this.dialog.closeAll();  
      }
    }
    
  }

  async mensaje(mensaje, servicee) {    
    const dialogRef = await this.dialog.open(DialogComponent);

    await dialogRef.afterClosed().subscribe(async (result) => {

      if(mensaje.view == 1)
      {
        if (result.success) {
          this.sesion.limpiarStorage();
          this.router.navigate(['']);
        }
      } else if(mensaje.view == 4) {
        if(result.success)
        {
          await this.eliminarProducto(servicee, mensaje.datos);
         
        }
      } else {

      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
  }

  openSnackBarTime(message: string, action: string, time: number) {
    this.snackBar.open(message, action, {
      duration: time * 1000,
    });
  }

  async validaInput(valor: any)
  {
    return (valor != null ? true : false);
  }

  async goTo(url: string)
  {
    this.router.navigate([url]);
  }

  async goToDatos(url: string, datos: any)
  {
    this.router.navigate([url, { datos: datos }]);
  }

  async eliminarProducto(service, info)
  {
    this.isBusy = true;
    
        this.sesion.guardarItemStorage('Dialogo', {titulo: "Eliminando registro"});
        this.showLoader(this.isBusy);
        
        const datos = {
          id: info.id
        };
        this.response = await this.convert.getValueApi( await service.eliminarProducto(this.Usuario, datos) );
    
        this.isBusy = false;
        this.showLoader(this.isBusy);
        if(this.response.success)
        {
          this.openSnackBarTime(this.response.message, 'Ok', 2);
        } else {
          this.openSnackBarTime(this.response.message, 'Cerrar', 1);
        }
  }
}
