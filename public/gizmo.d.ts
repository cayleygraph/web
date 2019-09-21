interface Path {
  all(): void;
  and(path: Path): Path;
  as(...tags: string[]): Path;
  back(tag?: string): Path;
  both(path: Path, ...tags: string[]): Path;
  count(): number;
  difference(path: Path): Path;
  except(path: Path): Path;
  filter(...args: any): Path;
  follow(path: Path): Path;
  followR(path: Path): Path;
  followRecursive(path: Path): Path;
  forEach(callback: (data: { [key: string]: any }) => void): void;
  forEach(
    limit: number,
    callback: (data: { [key: string]: any }) => void
  ): void;
  map(callback: (data: { [key: string]: any }) => void): void;
  map(limit: number, callback: (data: { [key: string]: any }) => void): void;
  getLimit(limit: number): void;
  has(predicate: string, object: string): Path;
  hasR(predicate: string, object: string): Path;
  in(predicatePath?: Path, ...tags: string[]): Path;
  inPredicates(): Path;
  intersect(path: Path): Path;
  is(node: string, ...nodes: string[]): Path;
  labelContext(labelPath: Path, ...tags: string[]): Path;
  labels(): Path;
  limit(limit: number): Path;
  or(path: Path): Path;
  out(predicatePath?: Path, ...tags: string[]): Path;
  outPredicates(): Path;
  save(predicate: string, tag: string): Path;
  saveOpt(predicate: string, tag: string): Path;
  saveOptR(predicate: string, tag: string): Path;
  saveR(predicate: string, tag: string): Path;
  saveInPredicates(tag: string): Path;
  saveOutPredicates(tag: string): Path;
  skip(offset: number): Path;
  tag(...tags: string[]): Path;
  tagArray(): void;
  tagValue(): void;
  toArray(): void;
  toValue(): void;
  union(path: Path): Path;
  unique(): Path;
}

interface Graph {
  V(...nodeId: string[]): Path;
  M(): Path;
  Vertex(...nodeId: string[]): Path;
  Morphism(): Path;
  loadNamespaces(): void;
  addDefaultNamespaces(): void;
  addNamespace(): void;
  emit(): void;
  IRI(): string;
}

declare var graph: Graph;
declare var g: Graph;

interface RegexFilter {}

declare function regex(expression: string, includeIRIs?: boolean): RegexFilter;
