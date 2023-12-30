import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { Article } from './article.model';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private readonly SERVER_DATA_KEY = makeStateKey<Article>("homeArticle");

  constructor(private http: HttpClient,
              private title: Title,
              private meta: Meta,
              private transferState: TransferState,
              @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      if (this.transferState.hasKey(this.SERVER_DATA_KEY)) {
        let article = this.transferState.get<any>(this.SERVER_DATA_KEY, undefined);
        this.initializeMetadata(article)
        this.transferState.remove(this.SERVER_DATA_KEY);
        return
      }
    }
    

    this.http.get<Article>("https://mohammed.ezzedine.me/api/articles/QK7WwzbwbvX")
    .subscribe({
      next: data => {
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(this.SERVER_DATA_KEY, data);
        }
        this.initializeMetadata(data)
      }
    })
  }

  initializeMetadata(article: Article) {
    this.title.setTitle(article.title);
    this.meta.addTag({ name: "description", property: "og:decription", content: article.description })
    this.meta.addTag({ name: "image", property: "og:image", content: article.imageUrl })
    this.meta.addTag({ name: "keywords", content: article.keywords.reduce((k1, k2) => k1 + ", " + k2) })
  }

}
