import React, { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import { UserReport, ExportPayload } from './pdf/UserReport';

interface ExportPdfModalProps {
  open: boolean;
  onClose: () => void;
  data: ExportPayload | null;
  periodLabel?: string;
}

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({ open, onClose, data, periodLabel }) => {
  const documentNode = useMemo(() => (data ? <UserReport data={data} periodLabel={periodLabel} /> : null), [data, periodLabel]);

  const handleDownload = async () => {
    if (!documentNode || !data) return;
    const blob = await pdf(documentNode).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `healthtrack-rapport-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = async () => {
    if (!documentNode || !data) return;
    const blob = await pdf(documentNode).toBlob();
    const url = URL.createObjectURL(blob);
    // Ouvrir dans un iframe caché pour lancer l'impression du PDF
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } finally {
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        }, 1000);
      }
    };
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o ? onClose() : undefined}>
      <DialogContent className="w-full max-w-[96vw] sm:max-w-[95vw] lg:max-w-[95vw] max-h-[96vh] sm:max-h-[96vh] lg:max-h-[96vh] m-[2vh] p-0 flex flex-col">
        <DialogHeader className="px-4 pt-4 flex-shrink-0">
          <DialogTitle>Prévisualisation du PDF</DialogTitle>
          <DialogDescription>Prévisualisation du PDF généré avant téléchargement ou impression</DialogDescription>
        </DialogHeader>
        <div className="px-4 pb-4 flex flex-col gap-3 flex-grow overflow-hidden">
          <div className="w-full flex-grow border rounded-md overflow-hidden bg-white" style={{ minHeight: 0 }}>
            {documentNode ? (
              <PDFViewer width="100%" height="100%" showToolbar={true} style={{ display: 'flex', flexDirection: 'column' }}>
                {documentNode}
              </PDFViewer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Aucune donnée à prévisualiser
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end flex-shrink-0">
            <Button variant="outline" onClick={handleDownload}>Télécharger le PDF</Button>
            <Button variant="outline" onClick={handlePrintPdf}>Imprimer le PDF</Button>
            <Button variant="default" onClick={onClose}>Fermer</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};