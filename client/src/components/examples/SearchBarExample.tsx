import { SearchBar } from "../SearchBar";

export default function SearchBarExample() {
  const handleSearch = (type: string, query: string) => {
    console.log("Search triggered:", { type, query });
  };

  return <SearchBar onSearch={handleSearch} defaultType="nik" />;
}
