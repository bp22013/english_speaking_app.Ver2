/* SWR用のfetcher定義ファイル */

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
