import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { EncriptacionUtilService } from './encriptacion-util.service';
import { ConvertsService } from './converts.service';

@Injectable({
  providedIn: 'root',
})
export class SesionService {
  constructor(
    private encript: EncriptacionUtilService,
    private convert: ConvertsService
  ) {}

  setAuth(key: string) {
    environment._User = null;
    this.limpiarStorage();
    return this.existe(key);
  }

  async guardarItemStorage(key: string, value: any) {
    getWindow().sessionStorage.removeItem(key);

    const encriptado = this.encript.encriptar(
      JSON.stringify(value),
      environment._tokenStorage
    );
    getWindow().sessionStorage.setItem(key, encriptado);
  }

  async obtenerItemStorage(key: string) {
    const value = getWindow().sessionStorage.getItem(key);
    const decryptValue = this.encript.desencriptar(
      value,
      environment._tokenStorage
    );
    return value ? JSON.parse(decryptValue) : null;
  }
  limpiarStorage() {
    getWindow().sessionStorage.clear();
  }

  obtenerItemStorageToken(key: string) {
    const value = getWindow().sessionStorage.getItem(key);
    const decryptValue = this.encript.desencriptar(
      value,
      environment._tokenStorage
    );
    return value ? JSON.parse(decryptValue) : null;
  }

  existe(key: string) {
    const value = getWindow().sessionStorage.getItem(key);
    return value == null ? false : true;
  }
}

function getWindow(): any {
  return window;
}
