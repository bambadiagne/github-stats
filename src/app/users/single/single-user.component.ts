import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SingleUser } from 'src/app/models/user';
import { GithubService } from 'src/app/services/github.service';
import html2canvas from 'html2canvas';
import { ImageSizeMedia } from 'src/app/models/size-bgimage-media';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css']
})
export class SingleUserComponent implements OnInit, OnDestroy {
  @ViewChild('profile_data') container?: ElementRef<HTMLElement>;
  public suscription: Subscription[] = [];
  public user: SingleUser | null | undefined;
  public showSpinner = true;
  public mediaSizeList = Object.entries(ImageSizeMedia).map(([name, size]) => ({ name, size }));
  public selectedMediaSize = '';
  constructor(
    private route: ActivatedRoute,
    private githubService: GithubService,
    public router: Router,
    public dialog: MatDialog
  ) {}
  ngOnDestroy(): void {
    this.suscription.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.suscription.push(
      this.githubService.retourDetailUser$.subscribe((user: SingleUser) => {
        this.showSpinner = false;
        this.user = user;
        if (user.websiteUrl && !user.websiteUrl.includes('http')) {
          user.websiteUrl = 'https://' + user.websiteUrl;
        }
        this.scrollToProfile();
      })
    );

    this.route.paramMap.subscribe((params: ParamMap) => {
      const login = params.get('login');
      if (login) {
        this.githubService.obtenirDetailUser(login);
      }
    });
    this.suscription.push(
      this.githubService.messageErreur$.subscribe((erreur) => {
        this.showSpinner = false;
        this.scrollToProfile();
        Utils.openAlertDialog(this.dialog, erreur);
      })
    );
  }

  private scrollToProfile() {
    setTimeout(() => {
      this.container?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  public getImageIcon(langage: string) {
    langage = langage.toLowerCase();
    if (langage === 'html') {
      langage = 'html5';
    }
    if (langage === 'css') {
      langage = 'css3';
    }
    if (langage === 'shell') {
      langage = 'bash';
    }
    if (langage.includes('jupyter')) {
      langage = 'jupyter';
    }
    if (langage === 'c++') {
      langage = 'cplusplus';
    }
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${langage}/${langage}-original.svg`;
  }
  public onError(event: Event) {
    const imageElement = event.target as HTMLImageElement | null;
    if (imageElement) {
      imageElement.src = 'assets/error-404.png';
    }
  }
  public goToHomePage() {
    this.router.navigate(['/users/senegal']);
  }
  public async downloadProfile() {
    const btn = document.getElementById('download-btn')!;
    btn.hidden = true;
    if (!this.container) {
      btn.hidden = false;
      return;
    }

    const profileContainer = this.container.nativeElement as HTMLElement;
    const svgRestorations = await this.replaceSvgImgsWithInlineSvg(profileContainer);

    try {
      const captureWidth = profileContainer.scrollWidth;
      const captureHeight = profileContainer.scrollHeight;

      const canvas = await html2canvas(profileContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#1e293b',
        imageTimeout: 15000,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        width: captureWidth,
        height: captureHeight,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
        logging: false
      });

      const rawDataUrl = canvas.toDataURL('image/png');
      const imageData = this.selectedMediaSize
        ? await this.letterboxImage(rawDataUrl, ...(this.selectedMediaSize.split('x').map(Number) as [number, number]))
        : rawDataUrl;
      this.downloadImage(imageData);
    } finally {
      this.restoreSvgImgs(svgRestorations);
      btn.hidden = false;
    }
  }

  /** Fetches each SVG <img> via CORS, parses it, and replaces the <img> with an
   *  inline <svg> so html2canvas can rasterize it natively. Returns undo data. */
  private async replaceSvgImgsWithInlineSvg(
    root: HTMLElement
  ): Promise<Array<{ placeholder: Comment; img: HTMLImageElement }>> {
    const restorations: Array<{ placeholder: Comment; img: HTMLImageElement }> = [];
    const images = Array.from(root.querySelectorAll('img')) as HTMLImageElement[];

    await Promise.all(
      images.map(async (img) => {
        const src = img.getAttribute('src') || '';
        if (!src.includes('.svg')) return;
        try {
          const response = await fetch(src, { mode: 'cors' });
          if (!response.ok) return;
          const svgText = await response.text();

          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
          if (svgDoc.querySelector('parsererror')) return;

          const svgEl = document.importNode(svgDoc.documentElement, true) as unknown as SVGSVGElement;
          const w = img.offsetWidth || img.width || 40;
          const h = img.offsetHeight || img.height || 40;
          svgEl.setAttribute('width', String(w));
          svgEl.setAttribute('height', String(h));
          svgEl.style.display = 'inline-block';
          svgEl.style.verticalAlign = 'middle';
          svgEl.style.flexShrink = '0';

          const placeholder = document.createComment('svg-restore-point');
          img.parentNode!.insertBefore(placeholder, img);
          img.parentNode!.replaceChild(svgEl, img);
          restorations.push({ placeholder, img });
        } catch {
          // leave as-is
        }
      })
    );

    return restorations;
  }

  private restoreSvgImgs(restorations: Array<{ placeholder: Comment; img: HTMLImageElement }>): void {
    for (const { placeholder, img } of restorations) {
      const parent = placeholder.parentNode;
      if (!parent) continue;
      const inlineSvg = placeholder.nextSibling;
      if (inlineSvg) parent.replaceChild(img, inlineSvg);
      placeholder.remove();
    }
  }

  private letterboxImage(sourceDataUrl: string, targetW: number, targetH: number): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, targetW, targetH);
        const scale = Math.min(targetW / img.width, targetH / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        ctx.drawImage(img, (targetW - drawW) / 2, (targetH - drawH) / 2, drawW, drawH);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(sourceDataUrl);
      img.src = sourceDataUrl;
    });
  }

  public onChange(e: Event) {
    this.selectedMediaSize = (e.target as HTMLSelectElement).value;
  }

  private downloadImage(imageData: string) {
    const link = document.createElement('a');
    link.setAttribute('download', this.user?.login! + '_github_stats');
    link.setAttribute('href', imageData);
    link.click();
  }
}
