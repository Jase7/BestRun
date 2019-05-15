import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  localStorageSupported: boolean;

  constructor() {
    this.localStorageSupported = typeof window['localStorage'] != "undefined" && window['localStorage'] != null;
  }

  add(key: string, value: string) {
    if (this.localStorageSupported) {
      localStorage.setItem(key, value);
      return value;
    }
    return Error('Not supported');
  }

  get(key: string) {
    if (this.localStorageSupported) {
      const item = localStorage.getItem(key);
      if (item == null) {
        return null;
      }
      return item;
    }
    return null;

  }

  change(key: string, value: string) {
    if(this.localStorageSupported) {
      localStorage.setItem(key, value);
    }
  }

  remove(key: string) {
    if (this.localStorageSupported) {
      localStorage.removeItem(key);
      return true;
    }
    return false;
  }

  clear() {
    if (this.localStorageSupported) {
      localStorage.clear();
      return true;
    }
    return false;
  }
}
