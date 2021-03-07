import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileService, HttpClientTestingModule],
    });
    service = TestBed.get(FileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload', () => {
    const resp = { url: 'file_url', signedUrl: 'file_url' };
    const blob = new Blob();
    const arrayOfBlob = [blob];
    const mockFile: File = new File(arrayOfBlob, 'test-file.jpg');
    service.upload(mockFile)
      .subscribe((url) => {
        expect(url).toEqual(resp);
      });
    expect(service.upload).toBeTruthy();
  });
});
