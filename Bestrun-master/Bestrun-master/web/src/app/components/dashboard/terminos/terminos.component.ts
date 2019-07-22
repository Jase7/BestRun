import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.component.html',
  styleUrls: ['./terminos.component.css']
})
export class TerminosComponent implements OnInit {

  constructor(private title : Title) { 

   title.setTitle("Roll&Race - Términos y condiciones")
  }

  ngOnInit() {
  }

}
