import { View, type ViewContext } from ".";

export function basicView(
  content: string | ((ctx: ViewContext) => Promise<string>)
) {
  return () => {
    const view = new View();
    view.setContent(content);

    return view;
  };
}
