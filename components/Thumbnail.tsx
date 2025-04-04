import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { getFileIcon } from "@/lib/utils";
interface props {
  type: string;
  extension: string;
  url: string;
  imageClassName?: string;
  className?: string;
}
export const Thumbnail = ({
  type,
  extension,
  url = "",
  imageClassName,
  className,
}: props) => {
  //figure is special html file compotypically used for usecases such as thumbnail
  const isImage = type === "image" && extension !== "svg";
  return (
    <figure className={cn("thumbnail", className)}>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnaul"
        width={100}
        height={100}
        className={cn(
          "size-8 object-contain",
          imageClassName,
          isImage && "thumbnail-image"
        )}
      />
    </figure>
  );
};

export default Thumbnail;
