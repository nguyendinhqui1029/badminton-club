import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, input, OnChanges, Output, signal, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FileModel } from '@app/models/file-upload.model';
import { FileService } from '@app/services/files.service';
import { FileUploadModule } from 'primeng/fileupload';
@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [FileUploadModule, CommonModule],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss'
})
export class UploadFileComponent implements OnChanges {

  imageListInput = input<FileModel[]>([]);
  isShowButtonAdd = input<boolean>(true);
  @Output() onFileChangeEvent = new EventEmitter<FileModel[]>();
  @ViewChild('fileUploadElement') fileUploadElement!: ElementRef;
  private fileService: FileService = inject(FileService);

  imageList = signal<FileModel[]>([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageListInput'].currentValue.length) {
      this.imageList.set(changes['imageListInput'].currentValue);
    }
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
        this.imageList.update((value: FileModel[]) => {
          value.push(...response.data.map((item: FileModel) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            linkCDN: item.linkCDN
          })));
          return value;
        });
        this.onFileChangeEvent.next(this.imageList());
      }
    });
  }

  handleRemoveFile(id: string) {
    this.fileService.removeFile([id]).subscribe((response)=>{
      if(response.statusCode === 200) {
        this.imageList.update((value: FileModel[]) => {
          const index = value.findIndex((item: FileModel) => item.id === id);
          if (index !== -1) {
            value.splice(index, 1);
          }
          return value;
        });
        this.onFileChangeEvent.next(this.imageList());
      }
    });
    
  }



}
