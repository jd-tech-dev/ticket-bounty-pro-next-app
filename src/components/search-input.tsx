'use client';

import { ChangeEvent } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from './ui/input';

/* If the search feature is used on a statically rendered page, 
you might encounter the error "Entire page de-opted into client-side rendering." 
In that case, you need to wrap the SearchInput component rendering in a Suspense boundary. */

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

const SearchInput = ({ value, onChange, placeholder }: SearchInputProps) => {
  const handleSearch = useDebouncedCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    200
  );

  return (
    <Input
      defaultValue={value}
      placeholder={placeholder}
      onChange={handleSearch}
      className="w-2/3"
    />
  );
};

export { SearchInput };
