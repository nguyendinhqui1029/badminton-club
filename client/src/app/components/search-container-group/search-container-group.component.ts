import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, input, OnChanges, OnDestroy, OnInit, Output, signal, SimpleChanges, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataSearchGroup } from '@app/models/search-group.model';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { LoadingComponent } from '@app/components/loading/loading.component';

@Component({
  selector: 'app-search-container-group',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, InputTextModule, LoadingComponent],
  templateUrl: './search-container-group.component.html',
  styleUrl: './search-container-group.component.scss'
})
export class SearchContainerGroupComponent<T> implements OnInit, OnChanges, OnDestroy {
  items = input.required<DataSearchGroup<T>[]>();
  initializeValue = input.required<string[]>();
  isMultipleSelect = input<boolean>(false);
  submitButtonLabel = input<string>('Chọn');
  searchTitle = input<string>('Tìm kiếm');
  searchPlaceholder = input<string>('Tìm kiếm...');
  resultLabel = input<string>('Kết quả');
  selectedItems = signal<Record<string, { isSelectedAll: boolean; itemsSelected: string[] }>>({});
  isLoading = input.required<boolean>();

  private unSubscription!: Subscription;
  private searchSubject = new Subject<string>();

  @ContentChild('contentRowTemplate') contentRowTemplate: TemplateRef<any> | null = null;
  @Output() searchInputChange = new EventEmitter<string>();
  @Output() onCloseDialog = new EventEmitter<DataSearchGroup<T>[]>();

  convertListToObject(list: DataSearchGroup<T>[]) {
    const objectMap: Record<string, { isSelectedAll: boolean; itemsSelected: string[] }> = {};
    list.forEach(item => {
      const selectedItems = this.initializeValue().filter((initItem) => item.children.find((child: Omit<T, 'id'> & {id: string}) => child['id'] === initItem)) || [];
      objectMap[item.id] = {
        isSelectedAll: selectedItems.length === item.children.length,
        itemsSelected: selectedItems
      };
    });
    return objectMap;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']?.currentValue?.length || changes['initializeValue']?.currentValue?.length) {
      this.selectedItems.set(this.convertListToObject(this.items()));
    }
  }

  ngOnInit(): void {
    this.unSubscription = this.searchSubject.pipe(debounceTime(300)).subscribe((value: string) => {
      this.searchInputChange.emit(value)
    });
  }

  mappingFinalSelectedItems(selectedItem: Record<string, { isSelectedAll: boolean; itemsSelected: string[] }>) {
    const result: DataSearchGroup<T>[] = [];
    Object.entries(selectedItem).forEach(([key, value]: [string, { isSelectedAll: boolean; itemsSelected: string[] }])=>{
      const item = this.items().find((item)=>item.id === key)
      if(value.itemsSelected.length) {
        result.push({ id: item?.id || '', groupName: item?.groupName || '', children: item?.children.filter((child)=>value.itemsSelected.includes(child.id)) || [] });
      }
    });
    return result;
  }

  onClickSubmit() {
    if (this.isMultipleSelect()) {
      this.onCloseDialog.emit(this.mappingFinalSelectedItems(this.selectedItems()));
    }
  }

  onOnlyItemSelect(parentId: string, childeId: string) {
    const childrenByGroup = (this.items() || []).find(item => item.id === parentId)?.children ;
    if (!this.isMultipleSelect()) {
      this.onCloseDialog.emit(this.mappingFinalSelectedItems({[parentId]: { isSelectedAll: (this.selectedItems()[parentId].itemsSelected || []).length === childrenByGroup?.length, itemsSelected: [childeId] }}));
    }
    this.selectedItems.update((value)=>{
      return {...value, [parentId]: {
        isSelectedAll:  (this.selectedItems()[parentId].itemsSelected || []).length === childrenByGroup?.length,
        itemsSelected: this.selectedItems()[parentId].itemsSelected || []
      }}
    });
  }

  onGroupClick(id: string) {
    if (!this.isMultipleSelect()) {
      return;
    }
    const hasChildrenGroup = this.items().find(item => item.id === id);
    this.selectedItems.update((value)=>({...value, 
      [id]: {
        isSelectedAll: this.selectedItems()[id].isSelectedAll,
        itemsSelected: this.selectedItems()[id].isSelectedAll ?  [...(hasChildrenGroup?.children || [])].map(item => item.id):[] 
      }
    }));
  }

  onClickCloseDialog() {
    this.onCloseDialog.emit(this.mappingFinalSelectedItems(this.convertListToObject(this.items())));
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
