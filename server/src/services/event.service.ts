import EventModel, { Event } from "../models/event.model";


class EventService {
  public async getAll(): Promise<Event[]> {
    return await EventModel.find();
  }

  public async getById(id: string): Promise<Event | null> {
    return await EventModel.findById(id);
  }

  public async create(event: Event): Promise<Event> {
    return await EventModel.create(event);
  }

  public async update(id: string, event: Event): Promise<Event | null> {
    return await EventModel.findByIdAndUpdate(id, event, { new: true });
  }

  public async delete(id: string): Promise<Event | null> {
    return await EventModel.findByIdAndDelete(id, { new: true });
  }
}

export default EventService;