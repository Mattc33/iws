import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent {

    // Nav expand/collaspe toggle
    isExpanded = true;
    isSideBarMini = false;

    // Nav children
    showNavChildrenCarrier = false;
    showNavChildrenRatecard = false;
    showNavChildrenCallplan = false;
    showNavChildrenLcr = false;

    toggleSideNav() {
        this.isExpanded = !this.isExpanded;
        this.isSideBarMini = !this.isSideBarMini;
    }

    toggleExpandClass(params) {
        if ( params === 'carrier' ) {
            this.showNavChildrenCarrier = !this.showNavChildrenCarrier;
            this.chevronRotate('.carrierChev');
        }
        if ( params === 'ratecard' ) {
            this.showNavChildrenRatecard = !this.showNavChildrenRatecard;
            this.chevronRotate('.ratecardChev');
        }
        if ( params === 'callplan') {
            this.showNavChildrenCallplan = !this.showNavChildrenCallplan;
            this.chevronRotate('.callplanChev');
        }
        if ( params === 'lcr') {
            this.showNavChildrenLcr = !this.showNavChildrenLcr;
            this.chevronRotate('.lcrChev');
        }
    }

    chevronRotate(_el) {
        const icon = document.querySelector(_el);
        icon.classList.toggle('rotate');
    }

}


