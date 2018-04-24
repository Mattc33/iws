import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent {

    isExpanded = true;
    isSideBarMini = false;

    toggleSideNav() {
        this.isExpanded = !this.isExpanded;
        this.isSideBarMini = !this.isSideBarMini;
    }

}


