import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from '../../Services/api-service.service';
import { ShowComponentService } from '../../Services/show-component.service';
import { MatDialog } from '@angular/material/dialog';
import { SesionService } from '../../Services/sesion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConvertsService } from '../../Services/converts.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  nombre: any;
  email: any;
  password: any;
  passwordCn: any;
  isBusy: boolean = false;
  response: any;
  message: any;

  constructor(private router: Router, private service: ApiServiceService,
    private showComponent: ShowComponentService, private sesion: SesionService,
        public dialog: MatDialog, private snackBar: MatSnackBar,
        private converter: ConvertsService
      )
  {

  }

  async registra()
  {
    this.isBusy = true;

    this.sesion.guardarItemStorage('Dialogo', {titulo: "Realizando registro"});
    this.showComponent.showLoader(this.isBusy);
    //this.cerrarSesion();
    
    if(await this.validaForm())
    {
      const data = {
        nombre: this.nombre,
        email: this.email,
        password: this.password
      }

      this.response = await this.converter.getValueApi( await this.service.registro(data) );

      this.isBusy = false;
      this.showComponent.showLoader(this.isBusy);
      
      if(this.response.success)
      {
        this.showComponent.openSnackBarTime(this.response.message, 'Cerrar', 2);
        await this.resetForm();
        await this.login();
      } else {
        this.showComponent.openSnackBar(this.response.message, 'Cerrar');
      }
    } else {
      this.isBusy = false;
      this.showComponent.showLoader(this.isBusy);

      this.showComponent.openSnackBar(this.message, 'Cerrar');
    }
  }

  async login()
  {
    this.showComponent.goTo('');
  }

  async validaForm()
  {
    if(this.password == this.passwordCn)
    {
      if( await this.showComponent.validaInput(this.nombre) 
        && await this.showComponent.validaInput(this.password) 
        && await this.showComponent.validaInput(this.email) )
      {
        return true;
      } else {
        this.message = "Formulario invalido";
        return false;
      }
    } else {
      this.message = "Las contraseñas no coinciden";
      return false;
    }
  }

  async resetForm()
  {
    this.nombre = null;
    this.email = null;
    this.password = null;
    this.passwordCn = null;
  }
}
