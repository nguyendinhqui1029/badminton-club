import UserService from '../services/user.service';
import AttendanceService from '../services/attendance.service';
import { Request, Response } from 'express';
import PostService from '../services/post.service';
import EventService from '../services/event.service';

export default class CommonController {
  private userService: UserService;
  private postService: PostService;
  private eventService: EventService;

  constructor() {
    this.userService = new UserService();
    this.postService = new PostService();
    this.eventService = new EventService();
  }

  public searchByKeyword = async (req: Request, res: Response): Promise<void> => {
    try {
      const keyword = req.query['query']?.toString() || '';
      const userResult = await this.userService.getUserByName(keyword);
      const postResult = await this.postService.getByName(keyword);
      const eventResult = await this.eventService.getByName(keyword);
      const result = [];
      if(userResult?.length) {
        result.push(...userResult.map((item)=>({
          type: 'USER',
          name: item.name,
          id: item.id,
          avatar: item.avatar})));
      }
      if(postResult?.length) {
        result.push(...postResult.map((item)=>({
          type: 'POST',
          name: item.content,
          id: item.id,
          avatar: item.images?.[0] || 'assets/images/post_default.webp'})));
      }
      if(eventResult?.length) {
        result.push(...eventResult.map((item)=>({
          type: 'EVENT',
          name: item.name,
          id: item.id,
          avatar: item.thumbnail || 'assets/images/event_default.webp'})));
      }
      res.status(200).json({
        statusCode: 200,
        statusText: 'Search is successful',
        totalCount: 0,
        page: 0,
        data: result
      });
    } catch (error: any) {
      res.status(200).json({
        statusCode: 500,
        statusText: 'Search is failed',
        totalCount: 0,
        page: 0,
        data: []
      });
    }
  };
}