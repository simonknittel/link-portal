import clsx from "clsx";
import Image from "next/image";
import { stringToColor } from "~/utils/stringToColor";

interface Props {
  className?: string;
  name?: string | null;
  image?: string | null;
  size?: number;
}

const Avatar = ({ className, name, image, size }: Props) => {
  return (
    <span
      className={clsx(
        className,
        "flex items-center justify-center overflow-hidden rounded uppercase",
        {
          "text-sm": size === 32,
          "text-2xl": !size || size === 64,
        }
      )}
      style={{
        backgroundColor: image
          ? undefined
          : name
          ? stringToColor(name)
          : "#dedfe0",
        width: size || 64,
        height: size || 64,
      }}
    >
      {image ? (
        <Image
          src={image}
          alt={`Image of ${name}`}
          width={size || 64}
          height={size || 64}
        />
      ) : name ? (
        name.replace(/\s/g, "").substring(0, 2)
      ) : null}
    </span>
  );
};

export default Avatar;
