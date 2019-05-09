import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageEvent'
})
export class ImageEventPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log(value);
    if(value)
      return value;
    return "assets/run.png";
  }

}
