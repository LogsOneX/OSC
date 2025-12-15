import { Timeline } from "../Timeline";

// todo: remove mock functionality
const mockEvents = [
  { id: "1", type: "account" as const, title: "Instagram Account Created", description: "New account registration detected", date: "2024-02-15", platform: "Instagram" },
  { id: "2", type: "breach" as const, title: "Data Breach Alert", description: "Email found in LinkedIn data breach", date: "2024-01-20", platform: "LinkedIn" },
  { id: "3", type: "activity" as const, title: "Email Activity", description: "Account verified on new platform", date: "2023-12-10", platform: "Tokopedia" },
  { id: "4", type: "vehicle" as const, title: "Vehicle Registration", description: "New vehicle registration B 1234 ABC", date: "2023-11-05" },
  { id: "5", type: "personal" as const, title: "Address Update", description: "Address changed to Jakarta Pusat", date: "2023-10-01" },
  { id: "6", type: "phone" as const, title: "New Phone Number", description: "Phone number +62812345678 registered", date: "2023-09-15" },
  { id: "7", type: "account" as const, title: "Facebook Account Created", description: "New account registration detected", date: "2022-06-20", platform: "Facebook" },
  { id: "8", type: "breach" as const, title: "Data Breach Alert", description: "Email found in Tokopedia breach", date: "2020-05-02", platform: "Tokopedia" },
];

export default function TimelineExample() {
  return <Timeline events={mockEvents} />;
}
