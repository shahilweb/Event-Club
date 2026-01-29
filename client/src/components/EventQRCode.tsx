import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useRef } from "react";

interface EventQRCodeProps {
  eventId: number;
  eventTitle: string;
  eventLink?: string;
  isPayment?: boolean;
  upiId?: string;
  amount?: number;
}

export function EventQRCode({
  eventId,
  eventTitle,
  eventLink,
  isPayment = false,
  upiId = "9565963595@ptaxis",
  amount = 60,
}: EventQRCodeProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  // Generate UPI link for payment
  const generateUPILink = () => {
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(eventTitle)}&am=${amount}&tn=EventRegistrationFee&tr=${eventId}`;
  };

  const link = isPayment 
    ? generateUPILink()
    : (eventLink || `${window.location.origin}/events/${eventId}/register`);

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (svg) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${eventTitle}-qr-code.png`;
        link.click();
        URL.revokeObjectURL(url);
      };

      img.src = url;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-lg bg-card">
      <div className="bg-white p-4 rounded border-2 border-gray-200">
        <div ref={qrRef}>
          <QRCodeSVG
            value={link}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>
      <div className="text-center">
        <p className="font-semibold text-sm">{eventTitle}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {isPayment ? `Pay ₹${amount} via UPI` : "Scan to Register"}
        </p>
        {isPayment && (
          <p className="text-xs text-amber-400 mt-1">UPI: {upiId}</p>
        )}
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={downloadQR}
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        Download QR Code
      </Button>

    </div>
  );
}
//  Email configuration
