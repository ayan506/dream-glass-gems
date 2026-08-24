import logo from "@/assets/logo-round.png";

/**
 * Default contact details — used as the SSR fallback and by the admin panel's
 * "reset to defaults". The live site reads these from site content, editable
 * in the admin panel (Contact tab).
 */
export const WHATSAPP_NUMBER = "9837866559";
export const PHONE_NUMBERS = ["9837866559", "9897055261"] as const;

export const LOGO_URL = logo;

export function Logo({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="Dream Glass Collection logo"
      className={`${className} rounded-full object-contain select-none`}
      width={96}
      height={96}
    />
  );
}
