import { Component, OnInit } from '@angular/core';
import { SesionService } from '../../../Services/sesion.service';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatPaginator,
  MatPaginatorModule,
  MatPaginatorIntl,
} from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatTooltipModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  View: number = 0;
  Descripcion: string = '';
  BtnUno: string = '';
  BtnDos: string = '';
  Titulo: string = '';
  dialogRefLoad: any;
  Mensaje: any;
  Dialogo: any;

  constructor(
    private sesion: SesionService,
    public dialogRef: MatDialogRef<DialogComponent>
  ) {}

  async ngOnInit(): Promise<void> {
    this.Dialogo = await this.sesion.obtenerItemStorage('Dialogo');

    if (this.Dialogo != null) {
      this.View = this.Dialogo.view;
      this.Titulo = this.Dialogo.titulo;
      this.Mensaje = this.Dialogo.mensaje;
      this.BtnUno = this.Dialogo.btnUno;
      this.BtnDos = this.Dialogo.btnDos;
    }
  }

  cerrarCataologs(indice) {
    if (indice == 1) {
      this.dialogRef.close({
        success: false,
        descripcion: this.Descripcion,
      });
    } else {
      this.dialogRef.close({
        success: true,
        descripcion: this.Descripcion,
      });
    }
  }
}
