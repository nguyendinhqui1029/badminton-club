import { Component, inject, signal } from '@angular/core';
import { SearchContainerDialogComponent } from '@app/components/dialogs/search-container-dialog/search-container-dialog.component';
import { LocationService } from '@app/services/location.service';
import { getUserLocation } from '@app/utils/common.util';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
  
@Component({
  selector: 'app-tag-location-dialog',
  standalone: true,
  imports: [SearchContainerDialogComponent],
  templateUrl: './tag-location-dialog.component.html',
  styleUrl: './tag-location-dialog.component.scss'
})
export class TagLocationDialogComponent {
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private dialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private locationService: LocationService = inject(LocationService);

  private userUnSubscription!: Subscription;

  items = signal<{id: string; name: string}[]>([]);
  selectedItems = signal<string[]>([]);
  currentUserId= signal<string>('');
  isLoading= signal<boolean>(true);

  onCloseDialog(value: {id: string; name: string}[]) {
    this.dynamicDialogRef.close(value);
  }

  getLocationOfUser(keyword: string) {
    this.isLoading.set(true);
    getUserLocation((position: {coords: {latitude: number; longitude: number;}})=>{
      const latitude = position?.coords?.latitude || 0;
      const longitude = position?.coords?.longitude || 0;
      this.locationService.getLocationNearby({keyword, latitude, longitude}).subscribe((response)=>{
        this.isLoading.set(false);
        if(response.statusCode === 200) {
          this.items.set(response.data.map((item)=>({id: item.id, name: item.address.label})))
        }
       });
    });
  
  }

  searchInputChange(value: string) {
    this.getLocationOfUser(value);
  }

  ngOnInit(): void {
    this.getLocationOfUser('');
    this.selectedItems.set(this.dialogConfig.data.initializeTagLocation)
  }

  ngOnDestroy(): void {
    if(this.userUnSubscription) {
      this.userUnSubscription.unsubscribe();
    }
  }
}
