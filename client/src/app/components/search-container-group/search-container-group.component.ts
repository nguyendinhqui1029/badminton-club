import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, input, OnChanges, OnDestroy, OnInit, Output, signal, SimpleChanges, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-container-group',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, InputTextModule],
  templateUrl: './search-container-group.component.html',
  styleUrl: './search-container-group.component.scss'
})
export class SearchContainerGroupComponent<T> implements OnInit, OnChanges, OnDestroy {
  items = input.required<{ id: string, groupName: string, children: (T & { id: string })[] }[]>();
  initializeValue = input.required<string[]>();
  isMultipleSelect = input<boolean>(false);
  submitButtonLabel = input<string>('Chọn');
  searchTitle = input<string>('Tìm kiếm');
  searchPlaceholder = input<string>('Tìm kiếm...');
  resultLabel = input<string>('Kết quả');
  selectedItems = signal<Record<string, { isSelectedAll: boolean; itemsSelected: string[] }>>({});

  private unSubscription!: Subscription;
  private searchSubject = new Subject<string>();

  @ContentChild('contentRowTemplate') contentRowTemplate: TemplateRef<any> | null = null;
  @Output() searchInputChange = new EventEmitter<string>();
  @Output() onCloseDialog = new EventEmitter<T[]>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']?.currentValue?.length || changes['initializeValue']?.currentValue?.length) {
      const objectMap: Record<string, { isSelectedAll: boolean; itemsSelected: string[] }> = {};
      this.items().forEach(item => {
        const selectedItems = this.initializeValue().filter((initItem) => item.children.find((child: (T & { id: string })) => child.id === initItem)) || [];
        objectMap[item.id] = {
          isSelectedAll: selectedItems.length === item.children.length,
          itemsSelected: selectedItems
        };
      });
      this.selectedItems.set(objectMap);
    }
  }

  ngOnInit(): void {
    this.unSubscription = this.searchSubject.pipe(debounceTime(300)).subscribe((value: string) => {
      this.searchInputChange.emit(value)
    });
  }

  // mappingFinalSelectedItems(selectedItem: string[]) {
  //   return (this.items() || []).filter((item: T)=> item.id && selectedItems().children.includes(item.id));
  // }

  onClickSubmit() {
    if (this.isMultipleSelect()) {
      // this.onCloseDialog.emit(this.mappingFinalSelectedItems(this.selectedItems()));
    }
  }

  onOnlyItemSelect(id: string) {
    if (!this.isMultipleSelect()) {
      // this.onCloseDialog.emit(this.mappingFinalSelectedItems([id]));
    }
  }

  onGroupClick(id: string) {
    if (!this.isMultipleSelect()) {
      // this.onCloseDialog.emit(this.mappingFinalSelectedItems([id]));
    }
    const hasChildrenGroup = this.items().find(item => item.id === id);
    this.selectedItems()[id] = {
      isSelectedAll: !this.selectedItems()[id].isSelectedAll,
      itemsSelected: this.selectedItems()[id].isSelectedAll ? [...(hasChildrenGroup?.children || [])].map(item => item.id) : []
    };
  }

  onClickCloseDialog() {
    // this.onCloseDialog.emit(this.mappingFinalSelectedItems(this.initializeValue()));
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  ngOnDestroy(): void {
    if (this.unSubscription) {
      this.unSubscription.unsubscribe();
    }
  }
}
