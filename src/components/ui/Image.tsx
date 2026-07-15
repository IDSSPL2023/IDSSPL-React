import type { CSSProperties, ImgHTMLAttributes } from "react";

/**
 * Drop-in replacement for `next/image`, rendering a plain `<img>`.
 * Accepts the same props the app already passes so call sites are unchanged;
 * the optimisation-only props (priority, quality, unoptimized, ...) are
 * accepted and ignored, since there is no image optimiser in a Vite SPA.
 */

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height"> & {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  /** Next's `fill`: the image absolutely fills its nearest positioned parent. */
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  unoptimized?: boolean;
  placeholder?: string;
  blurDataURL?: string;
};

const FILL_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
};

export default function Image({
  src,
  alt,
  width,
  height,
  fill,
  priority,
  quality: _quality,
  unoptimized: _unoptimized,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  style,
  ...rest
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={fill ? { ...FILL_STYLE, ...style } : style}
      {...rest}
    />
  );
}
