import { Component, OnInit, ViewChild } from '@angular/core';
import { ConvertsService } from '../../Services/converts.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiServiceService } from '../../Services/api-service.service';
import { SesionService } from '../../Services/sesion.service';
import { ShowComponentService } from '../../Services/show-component.service';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DialogComponent } from '../shared/dialog/dialog.component';

@Component({
  selector: 'app-prodcutos',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatFormFieldModule, MatTableModule, MatSortModule, FormsModule],
  templateUrl: './prodcutos.component.html',
  styleUrl: './prodcutos.component.css'
})
export class ProdcutosComponent implements OnInit {

   Usuario: any;
    totalPaginas = [10, 20, 30, 50, 100];
    paginas = [];
    productos = [];
    isBusy: boolean = false;
    selectTotal: number = 10;
    paginaInicio: number = 0;
    paginaFinal: number = 0;
    paginacion: number = 1;
    busqueda: any;
    response: any;
    anterior = "<";
    siguiente = ">";
    categorias : any;
    categoriaSelect : number = 0;
  
    displayedColumns: string[] = ['img', 'nombre', 'precio', 'id'];
    dataSource: any;
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
  sanitizer: any;
  
  constructor(private convert: ConvertsService,
        private sesion: SesionService,
        private router: Router, private service: ApiServiceService,
        private showComponent: ShowComponentService,
        public dialog: MatDialog, private converter: ConvertsService)
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

      await this.setPaginacion();
      this.getCategorias();
      
    } else {
      this.showComponent.goTo('');
    }
  }

  async setPaginacion()
  {
    this.paginaInicio = (parseInt(this.paginacion.toString()) == 1 ? 0 : (parseInt(this.paginacion.toString())-1) * 10);

    if(parseInt(this.selectTotal.toString()) > 50)
    {
      this.paginaFinal = parseInt(this.selectTotal.toString());
    }else {
      var separar = this.selectTotal.toString().replace("0", "");
      this.paginaFinal = parseInt(separar) * 10;
    } 

    
    await this.getProductos();
  }

  async getProductos()
    {
      this.isBusy = true;
  
      this.sesion.guardarItemStorage('Dialogo', {titulo: "Cargando catalogos"});
      this.showComponent.showLoader(this.isBusy);
      //this.cerrarSesion();
      
      const data = {
        paginaInicial: this.paginaInicio,
        paginaFinal: this.paginaFinal,
        totalPaginas: parseInt(this.selectTotal.toString()),
        nombre: this.busqueda,
        categoria: this.categoriaSelect
      }
      
      //console.log(data);
      this.response = await this.converter.getValueApi( await this.service.getProductos(this.Usuario, data) );
  
      this.isBusy = false;
      this.showComponent.showLoader(this.isBusy);
      
      if(this.response.success)
      {
        this.productos = this.response.data.datos;
        this.paginas = this.response.data.paginas;
        console.log(this.productos, this.paginas, this.response);
      } /*else {
        this.showComponent.openSnackBar(this.response.message, 'Cerrar');
      }*/
        
      
    }
  
    async setTabla()
    {
      this.dataSource.sort = this.sort;
    }
  
    cerrarSesion() {
      var mensaje = {
        titulo: 'Cerrar Sesión',
        mensaje: '¿Estas seguro de cerrar la sesion?',
        btnFalse: 'Cancelar',
        btnTrue: 'Continuar',
        view: 1,
      };
  
      this.sesion.guardarItemStorage('Dialogo', mensaje);
      const dialogRef = this.dialog.open(DialogComponent);
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.sesion.limpiarStorage();
          this.showComponent.goTo('');
        }
      });
    }
  
    async getImage(imga: any)
    {
      //console.log(imga);
      var imgSrc = 'data:image/jpeg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(imga.imgb4) as any).changingThisBreaksApplicationSecurity;
      return imgSrc;
    }
  
    async editar(row)
    {
      this.sesion.guardarItemStorage('Editar', row);
      this.showComponent.goTo('AddProducto');
      
    }
  
     async eliminar(row)
     {
      var mensaje = {
        titulo: '! Eliminar '+ row.nombre +' ¡',
        mensaje: '¿Estas seguro de eliminar registro?',
        btnUno: 'Cancelar',
        btnDos: 'Aceptar',
        view: 4,
        datos: row
      };
      this.sesion.guardarItemStorage('Dialogo', mensaje);
      var res = await this.showComponent.mensaje(mensaje, this.service);
      //console.log(res)
     }
  
     async cambio()
     {
        console.log(this.busqueda)
        await this.setPaginacion();
     }
  
     async setPaginas()
     {
      await this.setPaginacion();
     }
  
     async setPestania(item)
     {
      this.paginacion = parseInt(item.toString());
      await this.setPaginacion();
     }
  
     async setPestaniaLateral(indice)
     {
        this.paginacion = (indice == 1 ? this.paginacion - 1 : this.paginacion + 1);
        await this.setPaginacion();
     }

     async getCategorias()
  {
    
        this.isBusy = true;
    
        this.sesion.guardarItemStorage('Dialogo', {titulo: "Cargando catalogos"});
        this.showComponent.showLoader(this.isBusy);
        
       
        this.response = await this.converter.getValueApi( await this.service.getCategrias(this.Usuario) );
    
        this.isBusy = false;
        this.showComponent.showLoader(this.isBusy);
        if(this.response.success)
        {
          this.categorias = this.response.data;
          console.log(this.response)
        } 
          
  }

  async agregar(item)
  {
    this.sesion.guardarItemStorage('AgregarCarrito', item);
    this.showComponent.goTo('Detalle');
    //console.log(item);
  }

  async categoria(id)
  {
    this.categoriaSelect = parseInt(id.toString());
    await this.setPaginacion();
  }
}
