import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Fingerprint,
  User,
  Users,
  Phone,
  CreditCard,
  Mail,
  AtSign,
  Wallet,
  Car,
  Loader2,
} from "lucide-react";

const searchTypes = [
  { value: "nik", label: "NIK", icon: Fingerprint, placeholder: "Masukkan NIK (16 digit)" },
  { value: "name", label: "Nama", icon: User, placeholder: "Masukkan nama lengkap" },
  { value: "family", label: "Keluarga", icon: Users, placeholder: "Masukkan nama kepala keluarga" },
  { value: "phone", label: "Telepon", icon: Phone, placeholder: "Masukkan nomor telepon" },
  { value: "imei", label: "IMEI", icon: CreditCard, placeholder: "Masukkan nomor IMEI" },
  { value: "email", label: "Email", icon: Mail, placeholder: "Masukkan alamat email" },
  { value: "username", label: "Username", icon: AtSign, placeholder: "Masukkan username" },
  { value: "crypto", label: "Crypto Wallet", icon: Wallet, placeholder: "Masukkan alamat wallet" },
  { value: "vehicle", label: "Plat Kendaraan", icon: Car, placeholder: "Masukkan nomor plat" },
];

interface SearchBarProps {
  onSearch?: (type: string, query: string) => void;
  defaultType?: string;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, defaultType = "nik", isLoading = false }: SearchBarProps) {
  const [searchType, setSearchType] = useState(defaultType);
  const [query, setQuery] = useState("");

  const currentType = searchTypes.find((t) => t.value === searchType) || searchTypes[0];
  const Icon = currentType.icon;

  const handleSearch = () => {
    if (query.trim() && onSearch) {
      onSearch(searchType, query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Select value={searchType} onValueChange={setSearchType}>
          <SelectTrigger className="w-full sm:w-48" data-testid="select-search-type">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {searchTypes.map((type) => (
              <SelectItem key={type.value} value={type.value} data-testid={`option-${type.value}`}>
                <div className="flex items-center gap-2">
                  <type.icon className="h-4 w-4" />
                  <span>{type.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={currentType.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 font-mono"
            data-testid="input-search"
          />
        </div>

        <Button
          onClick={handleSearch}
          disabled={!query.trim() || isLoading}
          className="min-w-32"
          data-testid="button-search"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search
            </>
          )}
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {searchTypes.map((type) => (
          <Button
            key={type.value}
            variant={searchType === type.value ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSearchType(type.value)}
            className="text-xs"
            data-testid={`pill-${type.value}`}
          >
            <type.icon className="mr-1 h-3 w-3" />
            {type.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
