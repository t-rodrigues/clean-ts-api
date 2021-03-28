type SurveyResultAnswer = {
  image?: string;
  answer: string;
  count: number;
  percent: number;
  isCurrentAccountAnswer: boolean;
};

export type SurveyResult = {
  surveyId: string;
  question: string;
  answers: SurveyResultAnswer[];
  date: Date;
};
