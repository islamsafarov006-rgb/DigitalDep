import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Pipe({
  name: 'langField',
  standalone: true,
  pure: false
})
export class LangFieldPipe implements PipeTransform {
  private readonly transloco = inject(TranslocoService);

  transform(
    value: any,
    field?: string,
    config?: { [lang: string]: string }
  ): string {
    const lang = this.transloco.getActiveLang();
    const suffix = config?.[lang] ?? (lang === 'ru' ? 'Ru' : lang === 'kk' ? 'Kz' : 'En');

    if (typeof value === 'object' && value !== null && field) {
      const key = `${field}${suffix}`;
      return value[key] ?? value[field] ?? '';
    }
    if (typeof value === 'string') {
      return `${value}${suffix}`;
    }

    return '';
  }
}
