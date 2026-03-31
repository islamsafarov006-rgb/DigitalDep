import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
    selector: 'icon',
    standalone: true,
    template: `<div [innerHTML]="svgContent" class="icon"></div>`,
    styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
    @Input({ required: true }) name!: string;
    @Input() color?: string;
    @Input() size?: number = 21;

    svgContent?: SafeHtml;
    fillIcons = ['print', 'arrow-left', 'folder-check', 'person', 'compare', 'organization', 'department']

    constructor(private sanitizer: DomSanitizer) {}

    async ngOnInit() {
        const response = await fetch(`/assets/custom-icons/${this.name}.svg`);
        let svgText = await response.text();

        if (this.color) {
            svgText = svgText
                .replace(/stroke="[^"]*"/g, `stroke="${this.color}"`);
        }

        if (this.color && (this.fillIcons.includes(this.name))) {
            svgText = svgText
                .replace(/fill="[^"]*"/g, `fill="${this.color}"`);
        }

        svgText = svgText
            .replace(/width="[^"]*"/, `width="${this.size}"`)
            .replace(/height="[^"]*"/, `height="${this.size}"`);

        this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svgText);
    }

}
