import { Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-expand-collaspe',
  templateUrl: './expand-collaspe.component.html',
  styleUrls: ['./expand-collaspe.component.scss']
})
export class ExpandCollaspeComponent {

    @Output() collaspeExpandEvent = new EventEmitter();

    expandBtn = false;
    collaspeBtn = true;

    toggleSwapButtonsHandler(type) {
        if ( type === 'expand' ) {
            this.swap();
            this.collaspeExpandEvent.emit(true);
        }
        if ( type === 'collaspe' ) {
            this.swap();
            this.collaspeExpandEvent.emit(false);
        }
    }

    swap() {
        this.expandBtn = !this.expandBtn;
        this.collaspeBtn = !this.collaspeBtn;
    }

}
