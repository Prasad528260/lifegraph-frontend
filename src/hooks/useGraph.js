import { useSelector } from "react-redux";

const useGraph = () => {
  const { data, loading, error } = useSelector((state) => state.graph);
  return { graph: data, loading, error };
};

export default useGraph;