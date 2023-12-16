import { useMutation } from "@tanstack/react-query";

export const useMutationHooks = (cb) => {
  const mutation = useMutation({
    mutationFn: cb
  });
  return mutation;
};
