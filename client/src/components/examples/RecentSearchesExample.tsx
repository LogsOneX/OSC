import { RecentSearches } from "../RecentSearches";

// todo: remove mock functionality
const mockSearches = [
  { id: "1", type: "nik", query: "3201234567890001", timestamp: "2 menit lalu", resultCount: 1 },
  { id: "2", type: "email", query: "ahmad@email.com", timestamp: "15 menit lalu", resultCount: 3 },
  { id: "3", type: "phone", query: "+62812345678", timestamp: "1 jam lalu", resultCount: 2 },
  { id: "4", type: "vehicle", query: "B 1234 ABC", timestamp: "3 jam lalu", resultCount: 1 },
  { id: "5", type: "username", query: "ahmadsud", timestamp: "1 hari lalu", resultCount: 5 },
];

export default function RecentSearchesExample() {
  return (
    <RecentSearches
      searches={mockSearches}
      onSearchClick={(search) => console.log("Search clicked:", search)}
      onClear={() => console.log("Clear history clicked")}
    />
  );
}
