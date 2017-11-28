import { TestBed, inject } from '@angular/core/testing';

import { GetCarriersTableService } from './get-carriers-table.service';

describe('GetCarriersTableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetCarriersTableService]
    });
  });

  it('should be created', inject([GetCarriersTableService], (service: GetCarriersTableService) => {
    expect(service).toBeTruthy();
  }));
});
