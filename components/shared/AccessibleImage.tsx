import Image from "next/image";

interface AccessibleImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

/**
 * AccessibleImage component that ensures all images have descriptive alt text
 * Uses Next.js Image component for optimization
 * Requirements: 11.5, 12.4
 */
export function AccessibleImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = "",
  priority = false,
}: AccessibleImageProps) {
  // Ensure alt text is provided
  if (!alt || alt.trim() === "") {
    console.warn(
      `AccessibleImage: Missing or empty alt text for image: ${src}. Alt text is required for accessibility.`
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading={priority ? undefined : "lazy"}
    />
  );
}
