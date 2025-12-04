# Image Optimization Guide

## Overview

This portfolio uses Next.js Image component for automatic image optimization. All images are served in modern formats (AVIF, WebP) with automatic fallbacks.

## Configuration

The `next.config.ts` file is configured with:

- **Formats**: AVIF and WebP for modern browsers with automatic fallbacks
- **Device Sizes**: Optimized breakpoints for responsive images
- **Image Sizes**: Common icon and thumbnail sizes
- **Cache TTL**: 60 seconds minimum cache time

## Usage

### Using AccessibleImage Component

Always use the `AccessibleImage` component for images:

```tsx
import { AccessibleImage } from "@/components/shared/AccessibleImage";

<AccessibleImage
  src="/path/to/image.jpg"
  alt="Descriptive alt text"
  width={800}
  height={600}
  priority={false} // Set to true for above-the-fold images
/>
```

### Remote Images

For images from Supabase or other remote sources, ensure the domain is configured in `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "your-supabase-project.supabase.co",
    },
  ],
}
```

### Best Practices

1. **Always provide alt text** - Required for accessibility (Requirement 11.5)
2. **Use priority for above-the-fold images** - Improves LCP
3. **Specify width and height** - Prevents layout shift (CLS)
4. **Use lazy loading** - Default behavior for below-the-fold images
5. **Optimize source images** - Keep originals under 2MB

## Performance Benefits

- Automatic format conversion (AVIF, WebP)
- Responsive image generation
- Lazy loading by default
- Automatic cache headers
- Reduced bandwidth usage

## Requirements Satisfied

- **Requirement 11.5**: All images have descriptive alt text
- **Requirement 12.4**: Images optimized using Next.js Image component
