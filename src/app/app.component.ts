import { Component } from '@angular/core';
import {
  NavigationSkipped,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { SesionService } from './Services/sesion.service';
import {MatIconModule} from '@angular/material/icon';
import { ShowComponentService } from './Services/show-component.service';
import { ConvertsService } from './Services/converts.service';
import { ApiServiceService } from './Services/api-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatIconModule], //importar el componenete
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'PruebaTecnica';
  sesionActive = false;
  UsuarioEtiqueta = "";
  Usuario: any;
  Carrito: any;
  total: number = 0;
  totalDesc: any;
  rol: any;
  response: any;
  isBusy: boolean = false;
  TotalCarrito: number = 0;

  constructor(private router: Router, private sesion: SesionService,
    private showComponent: ShowComponentService, private convert: ConvertsService,
    private service: ApiServiceService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(async (event) => {
      if (!(event instanceof NavigationSkipped)) {
        if (event instanceof NavigationStart) {
          if (this.sesion.existe('User')) {
            this.sesionActive = true;

            this.Usuario = await this.convert.getValueStringParams( await this.sesion.obtenerItemStorage("User") );
            //this.Carrito = await this.convert.getValueStringParams( await this.sesion.obtenerItemStorage("Carrito") );
            
            this.UsuarioEtiqueta = `Hola ${this.Usuario.nombre}`;
            this.totalDesc = `$${this.total}`;

            this.rol = (this.Usuario.rol == "Cliente")

            if(this.rol)
            {
              await this.verCarrito();
            }
          } else {
            this.sesionActive = false;
          }
        }
      }
    });
  }

  async cerrarSesion()
  {
    var mensaje = {
      titulo: '! Cerrar Sesión ¡',
      mensaje: '¿Estas seguro de cerrar la sesión?',
      btnUno: 'Cancelar',
      btnDos: 'Aceptar',
      view: 1,
    };
    this.sesion.guardarItemStorage('Dialogo', mensaje);
    this.showComponent.mensaje(mensaje, this.service);
  }

  async compra()
  {

  }

  async agregarProducto()
  {
    this.showComponent.goTo('AddProducto');
  }

  async listaProductos()
  {
    if(this.Usuario.rol == "Administrador")
    {
      this.showComponent.goTo('Menu');
    } else {
      this.showComponent.goTo('Productos');
    }
    
  }

  async verCarrito()
  {
    this.isBusy = true;
    
        this.sesion.guardarItemStorage('Dialogo', {titulo: "Agregando al carrito"});
        this.showComponent.showLoader(this.isBusy);
        
        const data = {
          id: parseInt(this.Usuario.id),
        };

        this.response = await this.convert.getValueApi( await this.service.getCarrito(data) );
    
        this.isBusy = false;
        this.showComponent.showLoader(this.isBusy);
        
        if(this.response.success)
        {          
          this.Carrito = this.response.data;
          this.TotalCarrito = 0;
          await this.Carrito.forEach(element => {
            this.TotalCarrito = this.TotalCarrito + (element.precio * element.cantidadCarrito);
          });

          this.totalDesc = "$" + this.TotalCarrito.toString();
          console.log(this.Carrito);
        } 
  }

  openDropdown(e){
    e.stopPropagation();
  }

  async accion(indice, item)
  {
    if(indice == 1)
    {
      await this.quitarCarrito(item);
    } else {
      if(item.cantidad > 0)
      {
        await this.agregarCarrito(item);
      } else {
        this.showComponent.openSnackBarTime("Ya no se puede agregar mas cantidades de este producto", 'Cerrar', 2);
      }
    }
  }

  async agregarCarrito(item)
  {
    this.isBusy = true;
    
    this.sesion.guardarItemStorage('Dialogo', {titulo: "Agregando al carrito"});
    this.showComponent.showLoader(this.isBusy);
    
    const data = {
      id: item.id,
      idproducto: item.idproducto,
      idusuario: this.Usuario.id,
      cantidad: 1
    };

    this.response = await this.convert.getValueApi( await this.service.addCarrito(this.Usuario, data) );

    this.isBusy = false;
    this.showComponent.showLoader(this.isBusy);
    if(this.response.success)
    {;
      console.log(this.response)
      this.Carrito = this.response.data;

      this.TotalCarrito = 0;
          await this.Carrito.forEach(element => {
            this.TotalCarrito = this.TotalCarrito + (element.precio * element.cantidadCarrito);
          });

          this.totalDesc = "$" + this.TotalCarrito.toString();
    } 
  }

  async quitarCarrito(item)
  {
    this.isBusy = true;
    
        this.sesion.guardarItemStorage('Dialogo', {titulo: "Quitando del carrito"});
        this.showComponent.showLoader(this.isBusy);
        
        const data = {
          id: item.id,
          idproducto: item.idproducto,
          idusuario: this.Usuario.id,
          cantidad: 1
        };

        this.response = await this.convert.getValueApi( await this.service.quitCarrito(this.Usuario, data) );
    
        this.isBusy = false;
        this.showComponent.showLoader(this.isBusy);
        if(this.response.success)
        {;
          console.log(this.response)
          this.Carrito = this.response.data;

          this.TotalCarrito = 0;
          await this.Carrito.forEach(element => {
            this.TotalCarrito = this.TotalCarrito + (element.precio * element.cantidadCarrito);
          });

          this.totalDesc = "$" + this.TotalCarrito.toString();
        } 
  }
}
