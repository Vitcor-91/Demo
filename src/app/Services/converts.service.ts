import { Injectable } from '@angular/core';
import { EncriptacionUtilService } from './encriptacion-util.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ConvertsService {
  encryptionKey: string = '';

  constructor(private encript: EncriptacionUtilService) {
    this.encryptionKey = environment._tokenR;
  }

  async getValueApi(Param: any) {
    var json = JSON.stringify(Param);
    const JSobj = JSON.parse(json);
    var convertido = this.encript.desencriptar(
      JSobj.data.parms.toString(),
      this.encryptionKey
    );

    return JSON.parse(convertido);
  }

  async getValueString(Param: any) {
    return JSON.parse(Param);
  }

  async setValueStringParams(value: any) {
    return this.encript.encriptar(JSON.stringify(value), environment._token);
  }

  async getValueStringParams(value: any) {
    var json = JSON.stringify(value);
    const JSobj = JSON.parse(json);
    var respuesta = this.encript.desencriptar(JSobj, environment._token);

    return JSON.parse(respuesta);
  }
}
