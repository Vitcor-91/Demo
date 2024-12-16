import { Component, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SesionService } from '../../../Services/sesion.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent {
  Dialogo: any;
  Titulo: string = '';
  constructor(
    public dialogRef: MatDialogRef<LoaderComponent>,
    private sesion: SesionService
  ) {}

  async ngOnInit(): Promise<void> {
    this.Dialogo = await this.sesion.obtenerItemStorage('Dialogo');

    if (this.Dialogo != null) {
      this.Titulo = this.Dialogo.titulo;
    }
  }
}
