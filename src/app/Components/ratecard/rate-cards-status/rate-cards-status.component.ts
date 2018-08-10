import { Component } from '@angular/core';

@Component({
  selector: 'app-rate-cards-status',
  templateUrl: './rate-cards-status.component.html',
  styleUrls: ['./rate-cards-status.component.scss']
})
export class RateCardsStatusComponent  {

    current = 0;
    index = 'hi';

    pre(): void {
        this.current -= 1;
        this.changeContent();
    }

    next(): void {
        this.current += 1;
        this.changeContent();
    }

    done(): void {
        console.log('done');
    }

    changeContent(): void {
        switch (this.current) {
            case 0: {
                this.index = '<app-antd-upload-area></app-antd-upload-area>';
                break;
            }
            case 1: {
                this.index = 'Second-content';
                break;
            }
            case 2: {
                this.index = 'third-content';
                break;
            }
            default: {
                this.index = 'error';
            }
        }
    }

}
