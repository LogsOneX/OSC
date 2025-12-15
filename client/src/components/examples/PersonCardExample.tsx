import { PersonCard } from "../PersonCard";

// todo: remove mock functionality
const mockPersonData = {
  nik: "3201234567890001",
  name: "Ahmad Sudirman",
  birthDate: "15 Januari 1985",
  birthPlace: "Jakarta",
  gender: "Laki-laki",
  address: "Jl. Merdeka No. 123, RT 001/RW 002, Kelurahan Menteng",
  province: "DKI Jakarta",
  city: "Jakarta Pusat",
  district: "Menteng",
  village: "Menteng",
  religion: "Islam",
  maritalStatus: "Kawin",
  occupation: "Wiraswasta",
  nationality: "Indonesia",
  phones: ["+62812345678", "+62811234567"],
  emails: ["ahmad.sudirman@email.com", "a.sudirman@company.id"],
  verified: true,
};

export default function PersonCardExample() {
  return (
    <PersonCard
      data={mockPersonData}
      onViewNetwork={() => console.log("View network clicked")}
    />
  );
}
