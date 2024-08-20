import { Component, input, OnInit, signal } from '@angular/core';
import { imageOrientation } from '@app/constants/common.constant';
import { getImageOrientation } from '@app/utils/image.util';
import { catchError, combineLatest, of } from 'rxjs';

interface ImageOrientation { url: string, orientation: string };
@Component({
  selector: 'app-images-grid',
  standalone: true,
  imports: [],
  templateUrl: './images-grid.component.html',
  styleUrl: './images-grid.component.scss'
})
export class ImagesGridComponent implements OnInit{
images = input.required<string[]>();

imagesByOrientation = signal<ImageOrientation[]>([]);
displayImagesByOrientation = signal<ImageOrientation[]>([])
imageOrientation = imageOrientation;
maxImages: number = 4;
imageGroupByOrientation: {landscape: ImageOrientation[]; portrait: ImageOrientation[];} ={
  landscape: [],
  portrait: []
}
imageGridConfig: {totalColumn: number; landscapeSpan:number; portraitSpan: number}={totalColumn: 6, landscapeSpan: 6, portraitSpan: 2}
get visibleImages() {
  return this.imagesByOrientation().slice(0, this.maxImages);
}

get hasMoreImages() {
  return this.imagesByOrientation().length > this.maxImages;
} 

calculateGridColumns(imageType: {landscape: ImageOrientation[]; portrait: ImageOrientation[];}) {
  let totalColumn = 0;
  let landscapeSpan = 0;
  let portraitSpan = 0;

  const totalImage = imageType.landscape.length + imageType.portrait.length;
 

  // Calculate the total number of columns
  totalColumn = Math.max(imageType.landscape.length, imageType.portrait.length);
  landscapeSpan = totalColumn;
  portraitSpan = totalColumn/imageType.portrait.length;
  return {
    totalColumn,
    landscapeSpan,
    portraitSpan
  };
}

ngOnInit(): void {
  combineLatest(this.images().map((item: string)=>getImageOrientation(item).pipe(
    catchError(() => of(null))
  ))).subscribe((results) => {
    this.imagesByOrientation.set(results.filter(result => result !== null) as ImageOrientation[]);
    const newList = [...this.imagesByOrientation()].splice(0, this.maxImages);
    this.imageGroupByOrientation = {
      landscape: newList.filter((item:ImageOrientation) => item.orientation === imageOrientation.LANDSCAPE) || [],
      portrait: newList.filter((item:ImageOrientation) => item.orientation === imageOrientation.PORTRAIT) || [],
    };
    this.imageGridConfig = this.calculateGridColumns(this.imageGroupByOrientation)
    this.displayImagesByOrientation.set([...this.imageGroupByOrientation.landscape, ...this.imageGroupByOrientation.portrait]);
  });
}
}
