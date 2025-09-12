import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy, Mail, MessageSquare, Linkedin, Facebook, Twitter, Link } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function ShareModal({ isOpen, onClose, title, content }: ShareModalProps) {
  const [shareUrl] = useState(`${window.location.origin}/share/${Date.now()}`);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié !",
        description: "Le lien de partage a été copié dans le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      });
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`HealthTrack - ${title}`);
    const body = encodeURIComponent(`Consultez mon rapport HealthTrack :\n\n${content}\n\nLien : ${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaSocial = (platform: string) => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(`Consultez mon rapport HealthTrack - ${title}`);
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`
    };

    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Link className="h-5 w-5" />
            <span>Partager ce rapport</span>
          </DialogTitle>
          <DialogDescription>
            Partagez votre rapport HealthTrack avec vos proches ou professionnels de santé
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Lien de partage */}
          <div className="flex items-center space-x-2">
            <Input 
              value={shareUrl} 
              readOnly 
              className="flex-1"
            />
            <Button size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {/* Boutons de partage */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={shareViaEmail}
              className="w-full"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => shareViaSocial('whatsapp')}
              className="w-full"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => shareViaSocial('facebook')}
              className="w-full"
            >
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => shareViaSocial('linkedin')}
              className="w-full"
            >
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={onClose} className="w-full">
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}