import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class EncriptacionUtilService {
  constructor() {}

  encriptar(textoOriginal: string, claveSecreta: string) {
    try {
      const key = CryptoJS.enc.Utf8.parse(claveSecreta);
      const iv = CryptoJS.lib.WordArray.random(16);
      const encrypted = CryptoJS.AES.encrypt(textoOriginal, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      const cipherText = iv.concat(encrypted.ciphertext);
      return cipherText.toString(CryptoJS.enc.Base64);
    } catch (ex) {
      return null;
    }
  }

  dec(data: any, key: any) {
    var decrypted = CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8); // Message
    return decrypted;
  }

  desencriptar(textoEncriptado: string, claveSecreta: string) {
    try {
      const key = CryptoJS.enc.Utf8.parse(claveSecreta);
      const ciphertext = CryptoJS.enc.Base64.parse(textoEncriptado);
      const iv = ciphertext.clone();
      iv.sigBytes = 16;
      iv.clamp();

      const encryptedText = ciphertext.clone();
      encryptedText.words.splice(0, 4);
      encryptedText.sigBytes -= 16;

      const decrypted = CryptoJS.AES.decrypt(
        {
          ciphertext: encryptedText,
          salt: '',
        },
        key,
        { iv: iv }
      );

      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (ex) {
      return null;
    }
  }
}
