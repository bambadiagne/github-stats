import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SingleUser } from 'src/app/models/user';
import { GithubService } from 'src/app/services/github.service';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';
import { ImageSizeMedia } from 'src/app/models/size-bgimage-media';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css']
})
export class SingleUserComponent implements OnInit {
  @ViewChild('profile_data') container: ElementRef | undefined;
  public user: SingleUser | null | undefined;
  public showSpinner = true;
  public messageErreur = '';
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
    public router: Router
  ) {}

  ngOnInit(): void {
    this.githubService.retourDetailUser$.subscribe((user: SingleUser | any) => {
      this.showSpinner = false;
      this.user = user;
      document.getElementById('content')!.scrollIntoView(true);
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      const login = params.get('login');
      if (login) {
        this.githubService.obtenirDetailUser(login);
      }
    });
    this.githubService.messageErreur$.subscribe((erreur) => {
      document.getElementById('content')!.scrollIntoView(true);
      this.showSpinner = false;
      this.messageErreur = erreur;
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
  public onError(langage: string) {
    const element = this.elRef.nativeElement.querySelector(`[id="${langage}"]`);
    this.renderer.setAttribute(element, 'src', 'assets/error-404.png');
    // this.renderer.removeChild(element.parentNode, element);
  }
  public goToHomePage() {
    this.router.navigate(['/users/senegal']);
  }
  public downloadProfile() {
    document.getElementById('button-download')!.hidden = true;
    document.getElementById('select-social-media')!.hidden = true;
    const captureElement = document.querySelector('#profile_data');

    html2canvas(captureElement as HTMLElement, {
      scale: 1,
      useCORS: true,
      allowTaint: true
    }).then((canvas) => {
      if (!this.selectedMediaSize) {
        this.selectedMediaSize = ImageSizeMedia.TWITTER;
      }
      const ratio = this.selectedMediaSize.split('x');
      const desiredWidth = Number(ratio[0]); // Set your desired width
      const desiredHeight = Number(ratio[1]); // Set your desired height

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
    document.getElementById('select-social-media')!.hidden = false;
  }
  onChange(e: any) {
    this.selectedMediaSize = e.target.value;
  }
}
