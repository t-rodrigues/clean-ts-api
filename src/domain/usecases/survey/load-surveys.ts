import { Survey } from '@/domain/entities';

export interface LoadSurveys {
  load(): Promise<Survey[]>;
}
