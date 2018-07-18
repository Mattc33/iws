import { ExpandCollaspeComponent } from './expand-collaspe.component';

describe('ExpandCollaspeComponent', () => {
    let component: ExpandCollaspeComponent;

    beforeEach(() => {
        component = new ExpandCollaspeComponent;
    });

    it('collaspeExpandEvent should return true if input is "expand"', () => {
        component.toggleSwapButtonsHandler('expand');

        component.collaspeExpandEvent.subscribe(e => {
            expect(e).toBe(true);
        });
    });

    it('collaspeExpandEvent should return false if input is "collaspe"', () => {
        component.toggleSwapButtonsHandler('collaspe');

        component.collaspeExpandEvent.subscribe(e => {
            expect(e).toBe(false);
        });
    });

});
