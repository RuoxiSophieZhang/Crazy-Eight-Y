export type Difficulty = '初级' | '中级' | '高级';
export type Category = '定语从句' | '状语从句' | '非谓语动词' | '名词性从句' | '连词' | '独立主格';

export interface Question {
  id: string;
  sentence: string; // Use "______" for blank
  options: string[];
  correctAnswer: string;
  explanation: {
    rule: string;
    example: string;
    commonMistake: string;
  };
  difficulty: Difficulty;
  category: Category;
}
