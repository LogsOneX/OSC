import { NetworkGraph } from "../NetworkGraph";

// todo: remove mock functionality
const mockNodes = [
  { id: "person-1", type: "person" as const, label: "Ahmad Sudirman", data: { info: "NIK: 320123456789" } },
  { id: "phone-1", type: "phone" as const, label: "+62812345678", data: { info: "Telkomsel" } },
  { id: "phone-2", type: "phone" as const, label: "+62811234567", data: { info: "XL" } },
  { id: "email-1", type: "email" as const, label: "ahmad@email.com", data: { info: "email.com" } },
  { id: "vehicle-1", type: "vehicle" as const, label: "B 1234 ABC", data: { info: "Toyota Avanza" } },
  { id: "address-1", type: "address" as const, label: "Jl. Merdeka 123", data: { info: "Jakarta" } },
  { id: "person-2", type: "person" as const, label: "Siti Rahma", data: { info: "Spouse" } },
  { id: "wallet-1", type: "wallet" as const, label: "0x1234...5678", data: { info: "Ethereum" } },
];

const mockEdges = [
  { source: "person-1", target: "phone-1", relationship: "owns" },
  { source: "person-1", target: "phone-2", relationship: "owns" },
  { source: "person-1", target: "email-1", relationship: "uses" },
  { source: "person-1", target: "vehicle-1", relationship: "owns" },
  { source: "person-1", target: "address-1", relationship: "lives at" },
  { source: "person-1", target: "person-2", relationship: "married to" },
  { source: "person-1", target: "wallet-1", relationship: "owns" },
  { source: "person-2", target: "address-1", relationship: "lives at" },
];

export default function NetworkGraphExample() {
  return (
    <NetworkGraph
      nodes={mockNodes}
      edges={mockEdges}
      onNodeClick={(node) => console.log("Node clicked:", node)}
    />
  );
}
