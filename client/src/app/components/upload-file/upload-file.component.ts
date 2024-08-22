import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, inject, input, OnChanges, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FileModel } from '@app/models/file-upload.model';
import { FileService } from '@app/services/files.service';
import { FileUploadModule } from 'primeng/fileupload';
import { concatMap, EMPTY, Observable } from 'rxjs';
@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [FileUploadModule, CommonModule],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadFileComponent),
      multi: true
    }
  ]
})
export class UploadFileComponent implements ControlValueAccessor {
 
  isShowButtonAdd = input<boolean>(true);
  @ViewChild('fileUploadElement') fileUploadElement!: ElementRef;

  private fileService: FileService = inject(FileService);

  public onChange!: Function;
  public onTouched!: Function;
  public isDisabled: boolean = false;
  public imageList = signal<string[]>([]);
  public fileDeleted: string[] = [];

  public requestChangeStatusFile(callback: Function) {
    if(!this.imageList().length && !this.fileDeleted.length) {
      callback();
      return;
    }
    if(!this.imageList().length && this.fileDeleted.length) {
      this.fileService.removeFile(this.fileDeleted).subscribe(()=>callback());
      return;
    }
    if(this.imageList().length && !this.fileDeleted.length) {
      this.fileService.updateIsUsedFile({
        fileNames: this.imageList(),
        isUse: true
      }).subscribe(()=>callback());
      return;
    }
    this.fileService.updateIsUsedFile({
      fileNames: this.imageList(),
      isUse: true
    }).pipe(concatMap(()=>this.fileService.removeFile(this.fileDeleted))).subscribe(()=> callback());
  }

  writeValue(value: string[]): void {
    if(value && value.length) {
      this.imageList.set(value);
      return;
    }
    this.imageList.set([])
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  openDialogSelectFile() {
    this.fileUploadElement.nativeElement.click();
  }

  onFileChange(event: Event) {
    const files = (event.target as any)['files'] as File[];
    const formData = new FormData();
    for (let index = 0; index < files.length; index++) {
      formData.append('files', files[index]);
    }

    this.fileService.uploadFile(formData).subscribe((response) => {
      if (response.statusCode === 200) {
        this.imageList.update((value: string[]) => {
          value.push(...response.data.map((item: FileModel)=>item.linkCDN));
          return value;
        });
        this.onChange(this.imageList());
        this.onTouched();
      }
    });
  }

  handleRemoveFile(link: string) {
    const fileName = link.substring(link.lastIndexOf('/') + 1);
    this.imageList.update((value: string[]) => {
      return value.filter((item: string)=>!item.includes(fileName));
    });
    this.fileDeleted.push(fileName)
    this.onChange(this.imageList());
    this.onTouched();
  }
}
