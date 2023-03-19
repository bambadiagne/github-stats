import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SingleUser } from 'src/app/models/user';
import { GithubService } from 'src/app/services/github.service';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css']
})
export class SingleUserComponent implements OnInit {
  public user: SingleUser | null | undefined;
  public showSpinner = true;
  public messageErreur = '';
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
    console.log('rm lang', langage);
    const element = this.elRef.nativeElement.querySelector(`[id="${langage}"]`);
    this.renderer.setAttribute(element, 'src', 'assets/error-404.png');
    // this.renderer.removeChild(element.parentNode, element);
  }
  public goToHomePage() {
    this.router.navigate(['/users/senegal']);
  }
}
