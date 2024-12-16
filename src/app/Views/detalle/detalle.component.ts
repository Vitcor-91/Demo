import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiServiceService } from '../../Services/api-service.service';
import { ConvertsService } from '../../Services/converts.service';
import { SesionService } from '../../Services/sesion.service';
import { ShowComponentService } from '../../Services/show-component.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.css'
})
export class DetalleComponent implements OnInit {

  Usuario: any;
  Detalle: any;
  isBusy: boolean = false;
  response: any;

  constructor(
    private convert: ConvertsService,
                private sesion: SesionService,
                private router: Router, private service: ApiServiceService,
                private showComponent: ShowComponentService,
                public dialog: MatDialog, private converter: ConvertsService,
                private sanitizer: DomSanitizer
  )
  {
    
  }

  async ngOnInit(): Promise<void> {
    if (this.sesion.existe('User')) {
      this.Usuario = await this.convert.getValueStringParams( await this.sesion.obtenerItemStorage("User") );
      this.Detalle = await this.sesion.obtenerItemStorage("AgregarCarrito");
            
      console.log(this.Detalle);
    } else {
      this.showComponent.goTo('');
    }
  }

  async agregarCarrito()
  {
    this.isBusy = true;
    
        this.sesion.guardarItemStorage('Dialogo', {titulo: "Agregando al carrito"});
        this.showComponent.showLoader(this.isBusy);
        
        const data = {
          id: 0,
          idproducto: this.Detalle.id,
          idusuario: this.Usuario.id,
          cantidad: 1
        };

        console.log(this.Usuario)
        this.response = await this.converter.getValueApi( await this.service.setCarrito(this.Usuario, data) );
    
        this.isBusy = false;
        this.showComponent.showLoader(this.isBusy);
        if(this.response.success)
        {
          console.log(this.response)
          this.showComponent.goTo('Productos');
        } 
  }

}
