import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
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
  @ViewChild('profile_data') container!: ElementRef;
  public suscription: Subscription[] = [];
  public user: SingleUser | null | undefined;
  public showSpinner = true;
  public mediaSizeList = Object.entries(ImageSizeMedia).map(([socialMediaName, imageSize]) => ({
    socialName: socialMediaName,
    imageSize: imageSize
  }));
  public selectedMediaSize: string = '';
  constructor(
    private route: ActivatedRoute,
    private githubService: GithubService,
    private elRef: ElementRef,
    private renderer: Renderer2,
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
        document.getElementById('content')!.scrollIntoView(true);
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
        document.getElementById('content')!.scrollIntoView(true);
        this.showSpinner = false;
        Utils.openAlertDialog(this.dialog, erreur);
      })
    );
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
  public onError(langage: string) {
    const element = this.elRef.nativeElement.querySelector(`[id="${langage}"]`);
    this.renderer.setAttribute(element, 'src', 'assets/error-404.png');
    // this.renderer.removeChild(element.parentNode, element);
  }
  public goToHomePage() {
    this.router.navigate(['/users/senegal']);
  }
  public downloadProfile() {
    Utils.openAlertDialog(this.dialog, "Les dimensions de l'image dependront de la taille de votre écran.");
    document.getElementById('button-download')!.hidden = true;
    // document.getElementById('select-social-media')!.hidden = true;
    html2canvas(this.container.nativeElement as HTMLElement, {
      scale: 1,
      useCORS: true,
      allowTaint: true
    }).then((canvas) => {
      if (!this.selectedMediaSize) {
        this.selectedMediaSize = `${this.container.nativeElement.offsetWidth}x${this.container.nativeElement.offsetHeight}`;
      }
      const ratio = this.selectedMediaSize.split('x');

      const desiredWidth = Number(ratio[0]);
      const desiredHeight = Number(ratio[1]);

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = desiredWidth;
      tempCanvas.height = desiredHeight;
      const tempContext = tempCanvas.getContext('2d');

      if (tempContext) {
        tempContext.drawImage(canvas, 0, 0, desiredWidth, desiredHeight);
        const imageData = tempCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.setAttribute('download', this.user?.login! + '_github_stats');
        link.setAttribute('href', imageData);
        link.click();
      }
    });

    document.getElementById('button-download')!.hidden = false;
    // document.getElementById('select-social-media')!.hidden = false;
  }
  onChange(e: any) {
    this.selectedMediaSize = e.target.value;
  }
}
