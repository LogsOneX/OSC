import { AccountsCard } from "../AccountsCard";

// todo: remove mock functionality
const mockAccounts = [
  { platform: "Facebook", username: "ahmad.sudirman", registered: true, lastActive: "2024-01" },
  { platform: "Instagram", username: "ahmad_sudirman", registered: true, lastActive: "2024-02" },
  { platform: "Twitter", username: "ahmadsud", registered: true, lastActive: "2023-12" },
  { platform: "LinkedIn", username: "ahmad-sudirman", registered: true, profileUrl: "#" },
  { platform: "TikTok", registered: false },
  { platform: "WhatsApp", registered: true, lastActive: "2024-02" },
  { platform: "Telegram", username: "ahmadsud", registered: true },
  { platform: "GitHub", registered: false },
  { platform: "Spotify", registered: true },
  { platform: "Netflix", registered: true },
  { platform: "Discord", registered: false },
];

export default function AccountsCardExample() {
  return <AccountsCard accounts={mockAccounts} searchQuery="ahmad.sudirman@email.com" />;
}
