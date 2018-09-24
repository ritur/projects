import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {
childactivate=0
  constructor() { }

  ngOnInit() {
  }
  activeactivate(event,numbers:number) {
    console.log(this.childactivate);
    console.log(numbers);
    console.log(event.target.parentNode.parentNode.children[0].children)
    // console.log(event.target.parentNode.parentNode.children[0].children[this.childactivate].classList);
  //  if(event.target.parentNode.parentNode.children[0].children[this.childactivate].classList.contains('active'))
  //  { event.target.parentNode.parentNode.children[0].children[this.childactivate].classList.remove('active')}
  //   // event.target.parentNode
  //   event.target.classList.add("active")
    this.childactivate=numbers;
    console.log("2",this.childactivate);

  }
}
