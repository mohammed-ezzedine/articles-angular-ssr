import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Article } from './article.model';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient,
              private title: Title,
              private meta: Meta) { }

  ngOnInit(): void {
    this.http.get<Article>("https://mohammed.ezzedine.me/api/articles/QK7WwzbwbvX")
    .subscribe({
      next: data => {
        this.title.setTitle(data.title);
        this.meta.addTag({ name: "description", property: "og:decription", content: data.description })
        this.meta.addTag({ name: "image", property: "og:image", content: data.imageUrl })
        this.meta.addTag({ name: "keywords", content: data.keywords.reduce((k1, k2) => k1 + ", " + k2) })
      }
    })
  }

}
