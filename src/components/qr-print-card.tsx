import Image from "next/image";
import QRCode from "react-qr-code";

type QrPrintCardProps = {
  badgeAlt: string;
  badgeSrc: string;
  title: string;
  value: string;
};

export function QrPrintCard({
  badgeAlt,
  badgeSrc,
  title,
  value,
}: QrPrintCardProps) {
  return (
    <article className="flex break-inside-avoid flex-col items-center gap-4 rounded-[28px] border border-[#e7dfd5] bg-white p-6 shadow-none print:rounded-[20px] print:border-[#d8d0c6] print:p-5">
      <h2 className="text-center font-serif text-3xl text-[#4e3158] print:text-[28px]">
        {title}
      </h2>
      <div className="relative rounded-[24px] bg-white p-4">
        <QRCode
          level="H"
          size={180}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={value}
          viewBox="0 0 256 256"
        />
        <div className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white p-1">
          <Image
            alt={badgeAlt}
            className="h-auto w-full"
            height={40}
            src={badgeSrc}
            width={40}
          />
        </div>
      </div>
    </article>
  );
}
