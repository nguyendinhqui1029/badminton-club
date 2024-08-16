import SettingsModel, { Settings } from "../models/settings.model";

class SettingsService {
  public async getAll(): Promise<Settings[]> {
    return await SettingsModel.find();
  }

  public async getById(id: string): Promise<Settings | null> {
    return await SettingsModel.findById(id);
  }

  public async create(settings: Settings): Promise<Settings>  {
    return await SettingsModel.create(settings);
  }

  public async update(id: string, settings: Settings): Promise<Settings | null> {
    return await SettingsModel.findByIdAndUpdate(id, settings, { new: true });
  }

  public async delete(id: string): Promise<Settings | null> {
    return await SettingsModel.findByIdAndDelete(id, { new: true });
  }
}

export default SettingsService;