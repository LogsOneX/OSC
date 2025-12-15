import { ExportButton } from "../ExportButton";

export default function ExportButtonExample() {
  return (
    <ExportButton
      onExport={(format) => console.log("Exporting as:", format)}
    />
  );
}
