"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

// MediaItemType defines the structure of a media item
export interface MediaItemType {
  id: number;
  type: string;
  title: string;
  desc: string;
  url: string;
  span: string;
}

// MediaItem renders either a video or an image based on item.type
const MediaItem = ({
  item,
  className,
  onClick,
}: {
  item: MediaItemType;
  className?: string;
  onClick?: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsInView(entry.isIntersecting));
      },
      { root: null, rootMargin: "50px", threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  useEffect(() => {
    let mounted = true;
    const handleVideoPlay = async () => {
      if (!videoRef.current || !isInView || !mounted) return;
      try {
        if (videoRef.current.readyState >= 3) {
          setIsBuffering(false);
          await videoRef.current.play();
        } else {
          setIsBuffering(true);
          await new Promise<unknown>((resolve) => {
            if (videoRef.current) {
              videoRef.current.oncanplay = resolve;
            }
          });
          if (mounted) {
            setIsBuffering(false);
            await videoRef.current.play();
          }
        }
      } catch (error) {
        console.warn("Video playback failed:", error);
      }
    };

    if (isInView) {
      handleVideoPlay();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }

    const node = videoRef.current;
    return () => {
      mounted = false;
      if (node) {
        node.pause();
        node.removeAttribute("src");
        node.load();
      }
    };
  }, [isInView]);

  if (item.type === "video") {
    return (
      <div className={`${className} relative overflow-hidden`}>
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          onClick={onClick}
          playsInline
          muted
          loop
          preload="auto"
          style={{
            opacity: isBuffering ? 0.8 : 1,
            transition: "opacity 0.2s",
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          <source src={item.url} type="video/mp4" />
        </video>
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        )}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.url}
      alt={item.title}
      className={`${className} cursor-pointer object-cover`}
      onClick={onClick}
      loading="lazy"
      decoding="async"
    />
  );
};

interface GalleryModalProps {
  selectedItem: MediaItemType;
  isOpen: boolean;
  onClose: () => void;
  setSelectedItem: (item: MediaItemType | null) => void;
  mediaItems: MediaItemType[];
}

const GalleryModal = ({
  selectedItem,
  isOpen,
  onClose,
  setSelectedItem,
  mediaItems,
}: GalleryModalProps) => {
  const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 });
  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed inset-0 z-50 min-h-screen w-full overflow-hidden rounded-none backdrop-blur-lg sm:h-[90vh] md:h-[600px]"
      >
        <div className="flex h-full flex-col">
          <div className="flex flex-1 items-center justify-center bg-paper/50 p-2 sm:p-3 md:p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedItem.id}
                className="relative h-auto max-h-[70vh] w-full max-w-[95%] overflow-hidden rounded-none shadow-md sm:max-w-[85%] md:max-w-3xl"
                initial={{ y: 20, scale: 0.97 }}
                animate={{
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 0.5,
                  },
                }}
                exit={{
                  y: 20,
                  scale: 0.97,
                  transition: { duration: 0.15 },
                }}
                onClick={onClose}
              >
                <MediaItem
                  item={selectedItem}
                  className="h-full w-full bg-ink/20 object-contain"
                  onClick={onClose}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-2 sm:p-3 md:p-4">
                  <h3 className="font-serif text-base text-paper sm:text-lg md:text-xl">
                    {selectedItem.title}
                  </h3>
                  <p className="mt-1 text-xs text-paper/80 sm:text-sm">
                    {selectedItem.desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.button
          type="button"
          className="absolute right-2 top-2 rounded-full bg-paper/90 p-2 text-ink backdrop-blur-sm hover:bg-paper sm:right-2.5 sm:top-2.5 md:right-3 md:top-3"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close"
        >
          <X className="h-3 w-3" />
        </motion.button>
      </motion.div>

      {/* Draggable dock with thumbnails */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        initial={false}
        animate={{ x: dockPosition.x, y: dockPosition.y }}
        onDragEnd={(_, info) => {
          setDockPosition((prev) => ({
            x: prev.x + info.offset.x,
            y: prev.y + info.offset.y,
          }));
        }}
        className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 touch-none"
      >
        <motion.div className="relative cursor-grab rounded-none border border-mist bg-paper/95 shadow-sm backdrop-blur-md active:cursor-grabbing">
          <div className="flex -space-x-2 items-center px-3 py-2">
            {mediaItems.map((item, index) => (
              <motion.div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(item);
                }}
                style={{
                  zIndex:
                    selectedItem.id === item.id ? 30 : mediaItems.length - index,
                }}
                className={`relative h-8 w-8 flex-shrink-0 cursor-pointer overflow-hidden rounded-none hover:z-20 sm:h-9 sm:w-9 md:h-10 md:w-10 ${
                  selectedItem.id === item.id
                    ? "ring-2 ring-forest shadow-md"
                    : "ring-1 ring-mist hover:ring-ink/30"
                }`}
                initial={{ rotate: index % 2 === 0 ? -15 : 15 }}
                animate={{
                  scale: selectedItem.id === item.id ? 1.2 : 1,
                  rotate:
                    selectedItem.id === item.id
                      ? 0
                      : index % 2 === 0
                        ? -15
                        : 15,
                  y: selectedItem.id === item.id ? -8 : 0,
                }}
                whileHover={{
                  scale: 1.3,
                  rotate: 0,
                  y: -10,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  },
                }}
              >
                <MediaItem
                  item={item}
                  className="h-full w-full"
                  onClick={() => setSelectedItem(item)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

interface InteractiveBentoGalleryProps {
  mediaItems: MediaItemType[];
}

const InteractiveBentoGallery: React.FC<InteractiveBentoGalleryProps> = ({
  mediaItems,
}) => {
  const [selectedItem, setSelectedItem] = useState<MediaItemType | null>(null);
  const [items, setItems] = useState(mediaItems);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {selectedItem ? (
        <GalleryModal
          selectedItem={selectedItem}
          isOpen={true}
          onClose={() => setSelectedItem(null)}
          setSelectedItem={setSelectedItem}
          mediaItems={items}
        />
      ) : (
        <motion.div
          className="grid auto-rows-[60px] grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              layoutId={`media-${item.id}`}
              className={`relative cursor-move overflow-hidden rounded-none ${item.span}`}
              onClick={() => !isDragging && setSelectedItem(item)}
              variants={{
                hidden: { y: 50, scale: 0.9, opacity: 0 },
                visible: {
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 350,
                    damping: 25,
                    delay: index * 0.05,
                  },
                },
              }}
              whileHover={{ scale: 1.02 }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={1}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(_, info) => {
                setIsDragging(false);
                const moveDistance = info.offset.x + info.offset.y;
                if (Math.abs(moveDistance) > 50) {
                  const newItems = [...items];
                  const draggedItem = newItems[index];
                  const targetIndex =
                    moveDistance > 0
                      ? Math.min(index + 1, items.length - 1)
                      : Math.max(index - 1, 0);
                  newItems.splice(index, 1);
                  newItems.splice(targetIndex, 0, draggedItem);
                  setItems(newItems);
                }
              }}
            >
              <MediaItem
                item={item}
                className="absolute inset-0 h-full w-full"
                onClick={() => !isDragging && setSelectedItem(item)}
              />
              <motion.div
                className="absolute inset-0 flex flex-col justify-end p-2 sm:p-3 md:p-4"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
                <h3 className="relative line-clamp-1 font-serif text-xs text-paper sm:text-sm md:text-base">
                  {item.title}
                </h3>
                <p className="relative mt-0.5 line-clamp-2 text-[10px] text-paper/80 sm:text-xs md:text-sm">
                  {item.desc}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InteractiveBentoGallery;
