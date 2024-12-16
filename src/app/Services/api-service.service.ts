import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { EncriptacionUtilService } from './encriptacion-util.service';
import { lastValueFrom } from 'rxjs';
import { ShowComponentService } from './show-component.service';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  private UrlApi: string = environment.apiUrl;
  private encryptionKey: string = '';

  constructor(
    private http: HttpClient,
    private encript: EncriptacionUtilService,
    private component: ShowComponentService
  ) {
    this.encryptionKey = environment._token;
  }

  setParamsApi(user: any, value: any, tipo: any, modulo: any) {
    var fecha = new Date();
    var hora =
      (fecha.getHours() < 10 ? '0' + fecha.getHours() : fecha.getHours()) +
      ':' +
      (fecha.getMinutes() < 10 ? '0' + fecha.getMinutes() : fecha.getMinutes());
    var mes = fecha.getMonth() + 1;
    var fechaFormat =
      fecha.getFullYear() +
      '-' +
      (mes < 10 ? '0' + mes : mes) +
      '-' +
      (fecha.getDate() < 10 ? '0' + fecha.getDate() : fecha.getDate());

    var log = {
      udid: '',
      platform: 'Web',
      idAdmon: user.id,
      tipoRegistro: tipo,
      modulo: modulo,
      mail: user.email,
      fecha: fechaFormat,
      hora: hora,
      version: '1.0',
    };

    var resultado = this.encript.encriptar(
      JSON.stringify(value),
      this.encryptionKey
    );
    var logParam = this.encript.encriptar(
      JSON.stringify(log),
      this.encryptionKey
    );

    const parms = {
      parms: resultado,
      log: logParam,
    };

    return parms;
  }

  async login(user: any) {
    const parms = this.setParamsApi(user, user, 'ACCESO', 'LOGIN');

    try {
      const response$ = this.http.post(
        `${this.UrlApi}/user/login`,
        parms
      );
      const response = await lastValueFrom(response$);

      return response;
    } catch (error) {
      this.errorRed();
      throw error;
    }
  }

  async registro(user: any) {
    const parms = this.setParamsApi(user, user, 'REGISTRO', 'LOGIN');

    try {
      const response$ = this.http.post(
        `${this.UrlApi}/user/registro`,
        parms
      );
      const response = await lastValueFrom(response$);

      return response;
    } catch (error) {
      this.errorRed();
      throw error;
    }
  }

  async getProductos(user: any, datos: any) {
    const parms = this.setParamsApi(user, datos, 'REGISTRO', 'LOGIN');

    try {
      const response$ = this.http.post(
        `${this.UrlApi}/producto/getProductos`,
        parms
      );
      const response = await lastValueFrom(response$);

      return response;
    } catch (error) {
      this.errorRed();
      throw error;
    }
  }

  async getCategrias(user: any) {
    const parms = this.setParamsApi(user, user, 'REGISTRO', 'LOGIN');

    try {
      const response$ = this.http.post(
        `${this.UrlApi}/producto/getCategorias`,
        parms
      );
      const response = await lastValueFrom(response$);

      return response;
    } catch (error) {
      this.errorRed();
      throw error;
    }
  }

  async agregarProducto(user: any, data: any, file: File) {

    try {

      const formData = new FormData();

      formData.append("file", file);
      formData.append("values", data);

      const response$ = this.http.post(
        `${this.UrlApi}/producto/addProducto`,
        formData
      );
      const response = await lastValueFrom(response$);

      return response;
    } catch (error) {
      this.errorRed();
      throw error;
    }
  }

  async eliminarProducto(user: any, datos) {
    const parms = this.setParamsApi(user, datos, 'REGISTRO', 'LOGIN');

    try {
      const response$ = this.http.post(
        `${this.UrlApi}/producto/eliminarProducto`,
        parms
      );
      const response = await lastValueFrom(response$);

      return response;
    } catch (error) {
      this.errorRed();
      throw error;
    }
  }

  async setCarrito(user: any, datos) {
    const parms = this.setParamsApi(user, datos, 'REGISTRO', 'LOGIN');

    try {
      const response$ = this.http.post(
        `${this.UrlApi}/carrito/agregarCarrito`,
        parms
      );
      const response = await lastValueFrom(response$);

      return response;
    } catch (error) {
      this.errorRed();
      throw error;
    }
  }
  
  async getCarrito(user: any) {
    const parms = this.setParamsApi(user, user, 'REGISTRO', 'LOGIN');

    try {
      const response$ = this.http.post(
        `${this.UrlApi}/carrito/getCarrito`,
        parms
      );
      const response = await lastValueFrom(response$);

      return response;
    } catch (error) {
      this.errorRed();
      throw error;
    }
  }

  async addCarrito(user: any, data:any) {
    const parms = this.setParamsApi(user, data, 'REGISTRO', 'LOGIN');

    try {
      const response$ = this.http.post(
        `${this.UrlApi}/carrito/actualizaCarrito`,
        parms
      );
      const response = await lastValueFrom(response$);

      return response;
    } catch (error) {
      this.errorRed();
      throw error;
    }
  }
  
  async quitCarrito(user: any, data: any) {
    const parms = this.setParamsApi(user, data, 'REGISTRO', 'LOGIN');

    try {
      const response$ = this.http.post(
        `${this.UrlApi}/carrito/eliminarCarrito`,
        parms
      );
      const response = await lastValueFrom(response$);

      return response;
    } catch (error) {
      this.errorRed();
      throw error;
    }
  }

  async errorRed()
  {
    this.component.showLoader(false);
    this.component.openSnackBarTime("¡ Error de red, valide su conexión de internet !", 'Cerrar', 2);
  }
}
