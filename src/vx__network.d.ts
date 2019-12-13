declare module "@vx/network" {
  export interface DefaultNode {
    x: number;
    y: number;
  }

  export interface LinkType<Node> {
    source: Node;
    target: Node;
  }

  export interface GraphType<Link, Node> {
    links: Link[];
    nodes: Node[];
  }

  export interface LinkProvidedProps<Link> {
    link: Link;
  }

  export interface NodeProvidedProps<Node> {
    node: Node;
  }

  export type Props<Link, Node> = {
    /** Graph to render nodes and links for. */
    graph?: GraphType<Link, Node>;
    /** Component for rendering a single Link. */
    linkComponent:
      | string
      | React.FunctionComponent<LinkProvidedProps<Link>>
      | React.ComponentClass<LinkProvidedProps<Link>>;
    /** Component for rendering a single Node. */
    nodeComponent:
      | string
      | React.FunctionComponent<NodeProvidedProps<Node>>
      | React.ComponentClass<NodeProvidedProps<Node>>;
    /** Top transform offset to apply to links and nodes. */
    top?: number;
    /** Left transform offset to apply to links and nodes. */
    left?: number;
  };

  export declare function Graph<
    Link = LinkType<DefaultNode>,
    Node = DefaultNode
  >(props: Props<Link, Node>);
}
