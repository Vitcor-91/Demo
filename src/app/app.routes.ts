import { Routes } from '@angular/router';
import { HomePageComponent } from './Views/home-page/home-page.component';
import { LoginComponent } from './Views/login/login.component';
import { RegistroComponent } from './Views/registro/registro.component';
import { ProdcutosComponent } from './Views/prodcutos/prodcutos.component';
import { AgregaProductoComponent } from './Views/agrega-producto/agrega-producto.component';
import { DetalleComponent } from './Views/detalle/detalle.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'Registro', component: RegistroComponent },
    { path: 'Menu', component: HomePageComponent },
    { path: 'Productos', component: ProdcutosComponent },
    { path: 'AddProducto', component: AgregaProductoComponent },
    { path: 'Detalle', component: DetalleComponent },
];
