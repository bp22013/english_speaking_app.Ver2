/* 単語の型定義 */

export interface VocabularyItem {
    id: string;
    word: string;
    meaning: string | null;
    level: number | null;
    addedAt: string | null;
}
