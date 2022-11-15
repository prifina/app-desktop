import { useContext, createContext } from "react";

export const GraphQLContext = createContext(null);

export function useGraphQLContext() {
  return useContext(GraphQLContext);
}
