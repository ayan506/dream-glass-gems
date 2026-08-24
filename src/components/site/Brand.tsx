import logo from "@/assets/logo-round.asset.json";

/** WhatsApp is available on this number only. */
export const WHATSAPP_NUMBER = "9837866559";
/** Both numbers are used for calls across the site. */
export const PHONE_NUMBERS = ["9837866559", "9897055261"] as const;

export const WHATSAPP_LINK = `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Dream Glass Collection, I would like to enquire about your glass solutions.",
)}`;

export const LOGO_URL = logo.url;

export function Logo({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <img
      src={logo.url}
      alt="Dream Glass Collection logo"
      className={`${className} rounded-full object-contain select-none`}
      width={96}
      height={96}
    />
  );
}
