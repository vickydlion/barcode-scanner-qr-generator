import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BarcodeFormat, BrowserBarcodeReader, DecodeHintType, BrowserQRCodeSvgWriter } from '@zxing/library';
import { BeepService } from './providers/beep.service';
import * as svg from 'save-svg-as-png';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements AfterViewInit {
  @ViewChild('qrCode', { static: true }) qrCode: ElementRef;
  selectedDeviceId: string;
  errorMessage: string;
  barcodeResultString: string;
  svgElement: SVGSVGElement;

  constructor(private beepService: BeepService) {
  }

  ngAfterViewInit(): void {
    // Setting up possible formats 1D(ean13,code128)
    const hints = new Map();
    const formats = [ BarcodeFormat.EAN_13, BarcodeFormat.CODE_128 ];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    const codeReader = new BrowserBarcodeReader(500, hints);

    // getting VideoInputDevices and setting up back camera if available else front camera
    codeReader.getVideoInputDevices().then((videoInputDevices) => {
      if (videoInputDevices.length > 1) {
        videoInputDevices.forEach((element) => {
          if (element.label.match(/back/gi)) {
            this.selectedDeviceId = element.deviceId;
          }
        });
      } else {
        this.selectedDeviceId = videoInputDevices[0].deviceId;
      }
    });

    // starting decoding barcode
    codeReader.decodeOnceFromVideoDevice(this.selectedDeviceId, 'video').then((result) => {
      this.barcodeResultString = this.convertBarCodeResultToRequiredFormat(result);
      this.beepService.beep();
      // calling show Qr Code
      this.showQrCode();
    }).catch((err) => {
      console.error(err);
      this.errorMessage = err;
    });
  }

// converting barcode result data to required format
  convertBarCodeResultToRequiredFormat(result) {
    const format = result.getBarcodeFormat() === BarcodeFormat.EAN_13 ? 'EAN13' : 'CODE128';
    return `BSQRG|${format}|${result.getText()}`;
  }

  // print Qr code on Screen
  showQrCode() {
    const svgWriter = new BrowserQRCodeSvgWriter();
    this.svgElement = svgWriter.write(this.barcodeResultString, 300, 300);
    // displaying QRCode SVG in qrcode element
    this.qrCode.nativeElement.appendChild(this.svgElement);
  }

// download qr code as Png
  downloadPng() {
    svg.saveSvgAsPng(this.svgElement, 'qrcode.png', { backgroundColor: '#ffffff' });
  }
}
