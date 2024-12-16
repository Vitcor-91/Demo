import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../../Services/api-service.service';
import { ConvertsService } from '../../Services/converts.service';
import { SesionService } from '../../Services/sesion.service';
import { ShowComponentService } from '../../Services/show-component.service';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agrega-producto',
  standalone: true,
  imports: [MatCardModule, FormsModule],
  templateUrl: './agrega-producto.component.html',
  styleUrl: './agrega-producto.component.css'
})
export class AgregaProductoComponent implements OnInit {

  Usuario: any;
  response: any;
  isBusy: boolean = false;
  categorias = [];
  nombre: any;
  precio: any;
  selectCategoria: number = 0;
  descripcion: any;
  fileName: any;
  file: File;
  imageSrc: any = "../../../assets/cargaFile.png";
  message: any;
  cantidad: any;
  IdProducto: number = 0;
  edit: any;
  imageView: any;
  tituloBtn = "Guardar Producto";
  
  constructor(
    private convert: ConvertsService,
                private sesion: SesionService,
                private router: Router, private service: ApiServiceService,
                private showComponent: ShowComponentService,
                public dialog: MatDialog, private converter: ConvertsService,
                private route: ActivatedRoute
  ){

  }

  async ngOnInit(): Promise<void> {
    if (this.sesion.existe('User')) {
      this.Usuario = await this.convert.getValueStringParams( await this.sesion.obtenerItemStorage("User") );

      this.getCategorias();

      if(this.sesion.existe('Editar'))
      {
        this.edit = await this.sesion.obtenerItemStorage("Editar") ;

        console.log(this.edit);
        this.nombre = this.edit.nombre;
        this.precio = this.edit.precio;
        this.selectCategoria = this.edit.categoria;
        this.descripcion = this.edit.descripcion;
        this.cantidad = this.edit.cantidad;
        this.imageView = this.edit.img;
        this.IdProducto = this.edit.id;
        this.tituloBtn = "Actualizar Producto";
      }
      
    } else {
      this.showComponent.goTo('');
    }
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

  async getImg(){

  }

  onFileSelected(event) {

    this.file = event.target.files[0];

    if (this.file) {

        this.fileName = this.file.name;
        this.imageSrc = URL.createObjectURL(event.target.files[0]);

        //const upload$ = this.http.post("/api/thumbnail-upload", formData);

        //upload$.subscribe();
    }
  }

  async guardar()
  {
    this.isBusy = true;

    this.sesion.guardarItemStorage('Dialogo', {titulo: "Realizando registro"});
    this.showComponent.showLoader(this.isBusy);

    if(await this.validaForm())
    {
      const data = {
        nombre: this.nombre,
        precio: this.precio,
        categoria: parseInt(this.selectCategoria.toString()),
        descripcion: this.descripcion,
        cantidad: this.cantidad,
        id: this.IdProducto
      }

      var datos = await this.converter.setValueStringParams(data);
      this.response = await this.converter.getValueApi( await this.service.agregarProducto(this.Usuario, datos, this.file) );

      this.isBusy = false;
      this.showComponent.showLoader(this.isBusy);
      
      if(this.response.success)
      {
        this.showComponent.openSnackBarTime(this.response.message, 'Cerrar', 2);
        await this.resetForm();
      } else {
        this.showComponent.openSnackBar(this.response.message, 'Cerrar');
      }
    } else {
      this.isBusy = false;
      this.showComponent.showLoader(this.isBusy);

      this.showComponent.openSnackBarTime(this.message, 'Cerrar', 1);
    }
    
  }

  async validaForm()
  {
    if( await this.showComponent.validaInput(this.nombre) 
      && await this.showComponent.validaInput(this.precio) 
      && await this.showComponent.validaInput(this.selectCategoria)
      && await this.showComponent.validaInput(this.file)
      && await this.showComponent.validaInput(this.cantidad) )
    {
      if(this.selectCategoria > 0)
      {
        if(this.cantidad > 0)
          {
            return true;
          } else {
            this.message = "Cantidad de producto no valido";
            return false;
          }
      } else {
        this.message = "Seleccione una categoria";
        return false;
      }
    } else {
      this.message = "Formulario invalido";
      return false;
    }
  }

  async resetForm()
  {
    this.nombre = null;
    this.precio = null;
    this.selectCategoria = 0;
    this.descripcion = null;
    this.file = null;
    this.cantidad = null;
    this.imageSrc = "../../../assets/cargaFile.png";
  }
}
