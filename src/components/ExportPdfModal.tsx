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
      <DialogContent className="w-[95vw] h-[95vh] max-w-none max-h-none m-0 p-0 flex flex-col bg-background border-0 shadow-2xl rounded-xl overflow-hidden">
        {/* Override pour positionner le modal avec des marges et coins arrondis */}
        <style>{`
          @media (max-width: 768px) {
            [data-radix-dialog-content] {
              width: 98vw !important;
              height: 98vh !important;
              margin: 1vh 1vw !important;
              border-radius: 1rem !important;
            }
          }
          @media (min-width: 769px) {
            [data-radix-dialog-content] {
              width: 95vw !important;
              height: 95vh !important;
              margin: 2.5vh 2.5vw !important;
              border-radius: 1rem !important;
            }
          }
        `}</style>
        
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b bg-card rounded-t-xl">
          <DialogTitle className="text-xl font-bold">Prévisualisation du PDF</DialogTitle>
          <DialogDescription className="text-base">
            Prévisualisation du PDF généré avant téléchargement ou impression
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden p-6 pt-4 bg-card">
          <div className="w-full h-full border-2 border-border rounded-lg overflow-hidden bg-white shadow-sm">
            {documentNode ? (
              <PDFViewer 
                width="100%" 
                height="100%" 
                showToolbar={true}
                className="min-h-0 rounded-lg"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: 'none',
                  borderRadius: '0.5rem'
                }}
              >
                {documentNode}
              </PDFViewer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-lg rounded-lg">
                Aucune donnée à prévisualiser
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0 border-t bg-card px-6 py-4 rounded-b-xl">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={handleDownload}
              className="min-w-[160px] rounded-lg"
            >
              Télécharger le PDF
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePrintPdf}
              className="min-w-[140px] rounded-lg"
            >
              Imprimer le PDF
            </Button>
            <Button 
              variant="default" 
              onClick={onClose}
              className="min-w-[100px] rounded-lg"
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
