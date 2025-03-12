import { TravelPreference } from '../../../domain/entities/travel-preference';
import { TravelPreferenceRepository } from '../../../domain/repositories/travel-preference.repository';
import { TravelPreferenceModel } from './models/travel-preference.model';

export class MongoTravelPreferenceRepository implements TravelPreferenceRepository {
  async save(travelPreference: TravelPreference): Promise<TravelPreference> {
    const newTravelPreference = new TravelPreferenceModel({
      departureCity: travelPreference.departureCity,
      periodFrom: travelPreference.periodFrom,
      periodTo: travelPreference.periodTo,
      budget: travelPreference.budget
    });

    await newTravelPreference.save();

    return new TravelPreference(
      newTravelPreference.departureCity,
      newTravelPreference.periodFrom,
      newTravelPreference.periodTo,
      newTravelPreference.budget,
      newTravelPreference._id.toString(),
      newTravelPreference.lastSearchedAt || undefined
    );
  }

  async findAll(): Promise<TravelPreference[]> {
    const travelPreferences = await TravelPreferenceModel.find();
    return travelPreferences.map(tp => new TravelPreference(
      tp.departureCity,
      tp.periodFrom,
      tp.periodTo,
      tp.budget,
      tp._id.toString(),
      tp.lastSearchedAt || undefined
    ));
  }

  async findById(id: string): Promise<TravelPreference | null> {
    const travelPreference = await TravelPreferenceModel.findById(id);
    if (!travelPreference) return null;

    return new TravelPreference(
      travelPreference.departureCity,
      travelPreference.periodFrom,
      travelPreference.periodTo,
      travelPreference.budget,
      travelPreference._id.toString(),
      travelPreference.lastSearchedAt || undefined
    );
  }

  async findNextToSearch(): Promise<TravelPreference | null> {
    // Find preferences ordered by lastSearchedAt (null first, then oldest)
    const travelPreference = await TravelPreferenceModel.findOne()
      .sort({ lastSearchedAt: 1 })
      .exec();
    
    if (!travelPreference) return null;

    return new TravelPreference(
      travelPreference.departureCity,
      travelPreference.periodFrom,
      travelPreference.periodTo,
      travelPreference.budget,
      travelPreference._id.toString(),
      travelPreference.lastSearchedAt || undefined
    );
  }

  async update(id: string, travelPreference: TravelPreference): Promise<TravelPreference | null> {
    const updatedTravelPreference = await TravelPreferenceModel.findByIdAndUpdate(
      id,
      {
        departureCity: travelPreference.departureCity,
        periodFrom: travelPreference.periodFrom,
        periodTo: travelPreference.periodTo,
        budget: travelPreference.budget,
        lastSearchedAt: travelPreference.lastSearchedAt
      },
      { new: true }
    );

    if (!updatedTravelPreference) return null;

    return new TravelPreference(
      updatedTravelPreference.departureCity,
      updatedTravelPreference.periodFrom,
      updatedTravelPreference.periodTo,
      updatedTravelPreference.budget,
      updatedTravelPreference._id.toString(),
      updatedTravelPreference.lastSearchedAt || undefined
    );
  }

  async updateLastSearched(id: string, lastSearchedAt: Date): Promise<TravelPreference | null> {
    const updatedTravelPreference = await TravelPreferenceModel.findByIdAndUpdate(
      id,
      { lastSearchedAt },
      { new: true }
    );

    if (!updatedTravelPreference) return null;

    return new TravelPreference(
      updatedTravelPreference.departureCity,
      updatedTravelPreference.periodFrom,
      updatedTravelPreference.periodTo,
      updatedTravelPreference.budget,
      updatedTravelPreference._id.toString(),
      updatedTravelPreference.lastSearchedAt || undefined
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await TravelPreferenceModel.findByIdAndDelete(id);
    return !!result;
  }
} 