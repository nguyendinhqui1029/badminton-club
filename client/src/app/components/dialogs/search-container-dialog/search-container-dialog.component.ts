import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, input, OnChanges, OnDestroy, OnInit, Output, signal, SimpleChanges, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, Subject, Subscription } from 'rxjs';
@Component({
  selector: 'app-search-container-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, InputTextModule],
  templateUrl: './search-container-dialog.component.html',
  styleUrl: './search-container-dialog.component.scss'
})
export class SearchContainerDialogComponent<T extends { id?: string }> implements OnInit, OnChanges, OnDestroy{
 
  items = input.required<T[]>();
  initializeValue = input.required<string[]>();
  isMultipleSelect = input<boolean>(false);
  submitButtonLabel = input<string>('Chọn');
  searchTitle = input<string>('Tìm kiếm');
  searchPlaceholder = input<string>('Tìm kiếm...');
  resultLabel = input<string>('Kết quả');
  selectedItems = signal<string[]>([]);

  private unSubscription!:Subscription;
  private searchSubject = new Subject<string>();
  
  @ContentChild('contentRowTemplate') contentRowTemplate: TemplateRef<any> | null = null;
  @Output() searchInputChange = new EventEmitter<string>();
  @Output() onCloseDialog = new EventEmitter<T[]>();

  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['initializeValue']?.currentValue?.length) {
      this.selectedItems.set(this.initializeValue());
    }
  }

  ngOnInit(): void {
    this.unSubscription = this.searchSubject.pipe(debounceTime(300)).subscribe((value: string)=>{
      this.searchInputChange.emit(value)
    });
  }

  mappingFinalSelectedItems(selectedItem: string[]) {
    return (this.items() || []).filter((item: T)=> item.id && selectedItem.includes(item.id));
  }

  onClickSubmit() {
    if(this.isMultipleSelect()){
      this.onCloseDialog.emit(this.mappingFinalSelectedItems(this.selectedItems()));
    }
  }

  onOnlyItemSelect(id: string) {
    if(!this.isMultipleSelect()){
      this.onCloseDialog.emit(this.mappingFinalSelectedItems([id]));
    }
  }

  onClickCloseDialog() {
    this.onCloseDialog.emit(this.mappingFinalSelectedItems(this.initializeValue()));
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  ngOnDestroy(): void {
    if(this.unSubscription) {
      this.unSubscription.unsubscribe();
    }
  }
}
