import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { defaultAvatar } from '@app/constants/common.constant';
import { NotifyResponse } from '@app/models/notify.model';

@Component({
  selector: 'app-notify',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './notify.component.html',
  styleUrl: './notify.component.scss'
})
export class NotifyComponent {
 defaultAvatar = defaultAvatar;
 notifies: NotifyResponse[] = [
  {
    id: '123',
    isViewed: false,
    content: 'bg-blue-500-color w-4 h-4 rounded-full bg-blue-500-color w-4 h-4 rounded-full',
    shortContent: 'bg-blue-500-color w-4 h-4 rounded-full bg-blue-500-color w-4 h-4 rounded-full bg-blue-500-color w-4 h-4 rounded-full',
    from: {
      id: '1',
      name: 'Nguyễn Văn A',
      avatar: ''
    },
    to:[{
      id: '1',
      name: 'Nguyễn Văn A',
      avatar: ''
    }],
    createdAt: new Date('2024-09-01')
},
{
  id: '123',
  isViewed: true,
  content: 'bg-blue-500-color w-4 h-4 rounded-full bg-blue-500-color w-4 h-4 rounded-full',
  shortContent: 'bg-blue-500-color w-4 h-4 rounded-full bg-blue-500-color w-4 h-4 rounded-full bg-blue-500-color w-4 h-4 rounded-full',
  from: {
    id: '1',
    name: 'Nguyễn Văn A',
    avatar: ''
  },
  to:[{
    id: '1',
    name: 'Nguyễn Văn A',
    avatar: ''
  }],
  createdAt: new Date('2024-09-01')
}

 ];
}
