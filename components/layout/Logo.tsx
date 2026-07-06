import Image from "next/image";
import Link from "next/link";

type LogoVariant = "full" | "mark";
type LogoTheme = "light" | "dark";

// Theme "dark" = placed on a dark (aubergine) surface, so use the white asset.
const SOURCES: Record<LogoVariant, Record<LogoTheme, string>> = {
  full: { light: "/logo/sipmo-logo.png", dark: "/logo/sipmo-logo-white.png" },
  mark: { light: "/logo/sipmo-mark.png", dark: "/logo/sipmo-mark-white.png" }
};

// Real intrinsic dimensions so aspect ratio is preserved (nothing stretches).
const INTRINSIC: Record<LogoVariant, { width: number; height: number }> = {
  full: { width: 2508, height: 627 },
  mark: { width: 559, height: 521 }
};

type LogoProps = {
  variant?: LogoVariant;
  theme?: LogoTheme;
  /** Rendered height in px; width is derived from the real aspect ratio. */
  height?: number;
  priority?: boolean;
  /** Link target; pass null to render the image without a link. */
  href?: string | null;
  className?: string;
};

export function Logo({
  variant = "full",
  theme = "light",
  height = 36,
  priority = false,
  href = "/",
  className
}: LogoProps) {
  const intrinsic = INTRINSIC[variant];
  const width = Math.round((height * intrinsic.width) / intrinsic.height);

  const image = (
    <Image
      src={SOURCES[variant][theme]}
      alt="SIPMO"
      width={width}
      height={height}
      priority={priority}
      sizes={`${width}px`}
      style={{ height, width: "auto" }}
      className={className}
    />
  );

  if (href === null) {
    return image;
  }

  return (
    <Link href={href} aria-label="SIPMO home" className="inline-flex items-center">
      {image}
    </Link>
  );
}
