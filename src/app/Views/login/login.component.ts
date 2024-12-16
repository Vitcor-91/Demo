import { Component, OnInit } from '@angular/core';
import { ConvertsService } from '../../Services/converts.service';
import { SesionService } from '../../Services/sesion.service';
import { Router } from '@angular/router';
import { ApiServiceService } from '../../Services/api-service.service';
import { FormsModule } from '@angular/forms';
import { ShowComponentService } from '../../Services/show-component.service';
import { DialogComponent } from '../shared/dialog/dialog.component';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email: any;
  password: any;
  response: any;
  isBusy: boolean = false;
  //dialog: any;
  loader: any;
  contacto: string = "Víctor Hugo Solís Herrera | hugoo_54@hotmail.com";
  Usuario: any;

  constructor(private convert: ConvertsService,
      private sesion: SesionService,
      private router: Router, private service: ApiServiceService,
      private showComponent: ShowComponentService,
      public dialog: MatDialog, private converter: ConvertsService
    )
  {

  }
  
  async ngOnInit(): Promise<void> {
    if (this.sesion.existe('User')) {
      this.Usuario = await this.convert.getValueStringParams( await this.sesion.obtenerItemStorage("User") );
      
      if(this.Usuario.rol == "Administrador")
      {
        this.showComponent.goTo('Menu');
      } else {
        this.showComponent.goTo('Productos');
      }
    } else {
      this.email = "hugoo_54@hotmail.com";
      this.password = "123";
    }
  }
  
  async login()
  {
    this.isBusy = true;

    this.sesion.guardarItemStorage('Dialogo', {titulo: "Iniciando sesión"});
    this.showComponent.showLoader(this.isBusy);
    //this.cerrarSesion();
    
    if(await this.showComponent.validaInput(this.email) && await this.showComponent.validaInput(this.password))
    {
      const data = {
        email: this.email,
        password: this.password
      }

      this.response = await this.converter.getValueApi( await this.service.login(data) );

      this.isBusy = false;
      this.showComponent.showLoader(this.isBusy);
      
      if(this.response.success)
      {
        this.showComponent.openSnackBarTime(this.response.message, 'Cerrar', 2);
        const user = await this.converter.setValueStringParams(this.response.data);
        this.sesion.guardarItemStorage('User', user);
        this.sesion.guardarItemStorage('Token', this.response.data.token);

       if(user.rol == "Administrador")
       {
        await this.menu();
       } else {
        await this.productos();
       }
      } else {
        this.showComponent.openSnackBar(this.response.message, 'Cerrar');
      }
    } else {
      this.isBusy = false;
      this.showComponent.showLoader(this.isBusy);

      var mensaje = {
        titulo: '! Error ¡',
        mensaje: 'Email o Password incorrectos',
        btnUno: 'Aceptar',
        btnDos: '',
        view: 2,
      };
      this.sesion.guardarItemStorage('Dialogo', mensaje);
      this.showComponent.mensaje(mensaje, this.service);
    }
    
    

    
    
    //this.response = await this.service.login(data);
  }

  async registro()
  {
    this.showComponent.goTo('Registro');
  }

  async menu()
  {
    this.showComponent.goTo('Menu');
  }

  async productos()
  {
    this.showComponent.goTo('Productos');
  }
}


