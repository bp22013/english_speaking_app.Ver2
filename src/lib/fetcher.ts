/* SWR用のfetcher定義ファイル */

export const fetcher = async (url: string) => {
    console.log('🌐 fetcher called:', url);
    const res = await fetch(url);
    
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const text = await res.text();
    
    try {
        const data = JSON.parse(text);
        console.log('📦 fetcher result:', data);
        return data;
    } catch (error) {
        console.error('❌ JSON parse error:', error);
        console.error('Response text:', text);
        throw new Error(`JSON parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
