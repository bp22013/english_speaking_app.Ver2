/* SWR用のfetcher定義ファイル */

export const fetcher = async (url: string) => {
    console.log('🌐 fetcher called:', url);
    const res = await fetch(url);
    const data = await res.json();
    console.log('📦 fetcher result:', data);
    return data;
};
