export interface Answer {
  image?: string;
  answer: string;
}

export interface AddSurveyDTO {
  question: string;
  answers: Answer[];
  date: Date;
}

export interface AddSurvey {
  add(addSurveyData: AddSurveyDTO): Promise<void>;
}
