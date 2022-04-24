import { useState } from "preact/hooks";
import {} from "preact";

export default function SearchForm() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleOnInput = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form>
      <label htmlFor="search" class="block mr-2">
        Search music
      </label>
      <input
        id="search"
        type="text"
        autocomplete="off"
        value={searchTerm}
        onInput={handleOnInput}
      />
    </form>
  );
}
