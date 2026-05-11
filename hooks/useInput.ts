import { useState } from "react";

export const useInput = (): [
  string,
  (event: React.ChangeEvent<HTMLInputElement>) => void,
] => {
  const [value, setValue] = useState<string>("");
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  return [value, onChange];
};
