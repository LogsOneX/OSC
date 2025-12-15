import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Download, FileJson, FileSpreadsheet, FileText, Loader2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ExportFormat = "pdf" | "json" | "excel" | "doc";

interface ExportButtonProps {
  onExport?: (format: ExportFormat) => void;
  disabled?: boolean;
}

export function ExportButton({ onExport, disabled = false }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState<ExportFormat | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const handleExport = async (format: ExportFormat) => {
    setExportFormat(format);
    setShowDialog(true);
    setIsExporting(true);
    setExportProgress(0);

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setExportProgress(100);
      setIsExporting(false);
      onExport?.(format);
      
      setTimeout(() => {
        setShowDialog(false);
        toast({
          title: "Export Complete",
          description: `Your ${format.toUpperCase()} file has been downloaded.`,
        });
      }, 500);
    }, 2500);
  };

  const formatIcons: Record<ExportFormat, React.ElementType> = {
    pdf: FileText,
    json: FileJson,
    excel: FileSpreadsheet,
    doc: FileText,
  };

  const formatLabels: Record<ExportFormat, string> = {
    pdf: "PDF Document",
    json: "JSON Data",
    excel: "Excel Spreadsheet",
    doc: "Word Document",
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={disabled} data-testid="button-export">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Export Format</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(["pdf", "json", "excel", "doc"] as ExportFormat[]).map((format) => {
            const Icon = formatIcons[format];
            return (
              <DropdownMenuItem
                key={format}
                onClick={() => handleExport(format)}
                data-testid={`export-${format}`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {formatLabels[format]}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {exportFormat && (() => {
                const Icon = formatIcons[exportFormat];
                return <Icon className="h-5 w-5" />;
              })()}
              Exporting {exportFormat?.toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              {isExporting
                ? "Preparing your export file..."
                : "Export complete!"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Progress value={exportProgress} className="h-2" />
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {exportProgress}%
            </p>
          </div>

          <DialogFooter>
            {isExporting ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </Button>
            ) : (
              <Button onClick={() => setShowDialog(false)} data-testid="button-export-done">
                <Check className="mr-2 h-4 w-4" />
                Done
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
