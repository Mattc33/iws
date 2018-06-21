import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent {

    @Output() sidenavToggleEvent = new EventEmitter<boolean>();

    isExpanded = true;
    isSideBarMini = false;

    onToggleSidenav($event) {
        this.isExpanded = !this.isExpanded;
        this.isSideBarMini = !this.isSideBarMini;
        this.sidenavToggleEvent.emit(this.isSideBarMini);
    }

}
