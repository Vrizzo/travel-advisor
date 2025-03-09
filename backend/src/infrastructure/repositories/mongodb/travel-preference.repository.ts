import { TravelPreference } from '../../../domain/entities/travel-preference';
import { TravelPreferenceRepository } from '../../../domain/repositories/travel-preference.repository';
import { TravelPreferenceModel, TravelPreferenceDocument } from './models/travel-preference.model';

export class MongoTravelPreferenceRepository implements TravelPreferenceRepository {
  private documentToEntity(doc: TravelPreferenceDocument): TravelPreference {
    return new TravelPreference(
      doc.departureCity,
      doc.periodFrom,
      doc.periodTo,
      doc.budget,
      doc._id.toString()
    );
  }

  async save(preference: TravelPreference): Promise<TravelPreference> {
    const created = await TravelPreferenceModel.create({
      departureCity: preference.departureCity,
      periodFrom: preference.periodFrom,
      periodTo: preference.periodTo,
      budget: preference.budget
    });

    return this.documentToEntity(created);
  }

  async findAll(): Promise<TravelPreference[]> {
    const preferences = await TravelPreferenceModel.find().sort({ createdAt: -1 });
    return preferences.map(pref => this.documentToEntity(pref));
  }

  async findById(id: string): Promise<TravelPreference | null> {
    const preference = await TravelPreferenceModel.findById(id);
    return preference ? this.documentToEntity(preference) : null;
  }

  async update(id: string, preference: TravelPreference): Promise<TravelPreference | null> {
    const updated = await TravelPreferenceModel.findByIdAndUpdate(
      id,
      {
        departureCity: preference.departureCity,
        periodFrom: preference.periodFrom,
        periodTo: preference.periodTo,
        budget: preference.budget
      },
      { new: true }
    );

    return updated ? this.documentToEntity(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await TravelPreferenceModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
} 