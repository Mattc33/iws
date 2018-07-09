    import { Component, OnInit, ViewChild } from '@angular/core';

import { SideNavComponent } from './Containers/side-nav/side-nav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

    @ViewChild(SideNavComponent) topNavChild: SideNavComponent;

    isSideBarMini = false;

    eventReceiveSidenavToggle($event) {
        this.isSideBarMini = !this.isSideBarMini;
        this.topNavChild.toggleSideNav();
    }

}
