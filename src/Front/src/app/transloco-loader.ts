import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import {lang} from 'moment';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);


  getTranslation(lang: string) {
    const path = `assets/i18n/${lang}.json`;
    return this.http.get<Translation>(`./${path}`);
  }
}
