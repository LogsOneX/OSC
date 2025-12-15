import { VehicleCard } from "../VehicleCard";

// todo: remove mock functionality
const mockVehicleData = {
  plateNumber: "B 1234 ABC",
  brand: "Toyota",
  model: "Avanza",
  year: 2020,
  color: "Hitam",
  engineNumber: "2NR-FE-12345678",
  chassisNumber: "MHKM1BA3JLJ123456",
  fuelType: "Bensin",
  engineCapacity: "1496 cc",
  registrationDate: "15 Maret 2020",
  expiryDate: "15 Maret 2025",
  registrationStatus: "active" as const,
  ownerName: "Ahmad Sudirman",
  ownerAddress: "Jl. Merdeka No. 123, Jakarta Pusat, DKI Jakarta",
  ownerNik: "3201234567890001",
  taxStatus: "paid" as const,
  lastTaxPayment: "10 Januari 2024",
};

export default function VehicleCardExample() {
  return (
    <VehicleCard
      data={mockVehicleData}
      onViewOwner={() => console.log("View owner clicked")}
    />
  );
}
