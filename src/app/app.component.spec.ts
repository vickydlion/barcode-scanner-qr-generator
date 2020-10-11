import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should match required Format as 'MISHIPAY|BarcodeType|BarcodeValue' for Qr code data`, () => {
    const barCodeResultData = {
      getText: () => {
        return '978020137962';
      },
      getBarcodeFormat: () => {
        return 4;
      }
    };
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.convertBarCodeResultToRequiredFormat(barCodeResultData)).toEqual('MISHIPAY|CODE128|978020137962');
  });

  it('should render a SVG element having QR code', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.barcodeResultString = 'MISHIPAY|CODE128|978020137962';
    app.showQrCode();
    expect(app.qrCode.nativeElement.children[0] instanceof SVGSVGElement).toEqual(true);
  });
});
