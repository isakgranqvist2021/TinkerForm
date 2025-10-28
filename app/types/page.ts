export interface PageProps<T = undefined, K = undefined> {
  params: Promise<T>;
  searchParams: Promise<K>;
}
