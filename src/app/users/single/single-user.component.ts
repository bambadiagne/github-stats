import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SingleUser } from 'src/app/models/user';
import { GithubService } from 'src/app/services/github.service';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css']
})
export class SingleUserComponent implements OnInit {
  public user: SingleUser | undefined;
  public showSpinner = true;
  constructor(
    private route: ActivatedRoute,
    private githubService: GithubService,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.githubService.retourDetailUser$.subscribe((user: SingleUser) => {
      this.showSpinner = false;
      this.user = user;
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      const login = params.get('login');
      if (login) {
        this.githubService.obtenirDetailUser(login);
      }
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
    const request = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${langage}/${langage}-original.svg`;
    return request;
  }
  public onError(langage: string) {
    console.log('rm lang', langage);
    const element = this.elRef.nativeElement.querySelector(`[id="${langage}"]`);
    this.renderer.setAttribute(element, 'src', 'assets/error-404.png');
    // this.renderer.removeChild(element.parentNode, element);
  }
}
