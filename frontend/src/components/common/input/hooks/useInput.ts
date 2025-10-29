import { ChangeEvent, useState } from 'react';

interface UseInputProps<T> {
  initialValue: T;
  validator?: (value: T) => boolean;
}

interface UseInputReturn<T> {
  value: T;
  setValue: (value: T) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  setError: (error: boolean) => void;
}

export function useInput<T>({ initialValue, validator }: UseInputProps<T>): UseInputReturn<T> {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value as unknown as T;
    setValue(newValue);

    if (validator) {
      setError(!validator(newValue));
    }
  };

  return {
    value,
    setValue,
    onChange,
    error,
    setError,
  };
}
