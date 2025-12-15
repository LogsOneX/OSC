import { BreachCard } from "../BreachCard";

// todo: remove mock functionality
const mockBreaches = [
  {
    id: "1",
    name: "LinkedIn",
    domain: "linkedin.com",
    breachDate: "2021-06-22",
    addedDate: "2021-06-29",
    pwnCount: 700000000,
    description:
      "In June 2021, data from LinkedIn was scraped and posted for sale on a hacking forum.",
    dataClasses: ["Email addresses", "Names", "Phone numbers", "Employers"],
    isVerified: true,
    isSensitive: false,
  },
  {
    id: "2",
    name: "Tokopedia",
    domain: "tokopedia.com",
    breachDate: "2020-03-17",
    addedDate: "2020-05-02",
    pwnCount: 91000000,
    description:
      "In 2020, Indonesian e-commerce platform Tokopedia suffered a data breach exposing 91 million user records.",
    dataClasses: ["Email addresses", "Passwords", "Usernames", "Phone numbers", "Gender"],
    isVerified: true,
    isSensitive: true,
  },
  {
    id: "3",
    name: "Bukalapak",
    domain: "bukalapak.com",
    breachDate: "2019-03-01",
    addedDate: "2019-05-15",
    pwnCount: 13000000,
    description:
      "Bukalapak, an Indonesian e-commerce platform, was breached in 2019.",
    dataClasses: ["Email addresses", "Passwords", "Usernames"],
    isVerified: true,
    isSensitive: false,
  },
];

export default function BreachCardExample() {
  return <BreachCard breaches={mockBreaches} email="ahmad.sudirman@email.com" />;
}
