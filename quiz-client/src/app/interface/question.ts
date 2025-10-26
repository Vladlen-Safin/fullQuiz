export interface IQuestion {
    text: string;
    type: 'single' | 'multiple' | 'open';
    options?: string[];
    correctAnswers: string[] | string;
    gameGroupId: string;
}