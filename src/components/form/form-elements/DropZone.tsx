import { useState, useCallback } from "react";
import ComponentCard from "../../common/ComponentCard";
import { useDropzone } from "react-dropzone";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { uploadProductImages } from "../../../services/productService";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import Cropper from "react-easy-crop";

const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(",");

  const mime = arr[0].match(/:(.*?);/)?.[1];

  const bstr = atob(arr[1]);

  let n = bstr.length;

  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, {
    type: mime,
  });
};

/* -- WebP Conversion -- */
const convertToWebP = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      resolve(canvas.toDataURL("image/webp", 0.85));
    };
  });
};

/* -- Crop Image -- */
const getCroppedImage = async (
  imageSrc: string,
  crop: any,
  rotation: number,
  zoom: number,
) => {
  const image = new Image();
  image.src = imageSrc;

  await new Promise((res) => (image.onload = res));

  const canvas = document.createElement("canvas");

  const width = 1200;
  const height = 1600;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  // center + rotate
  ctx?.translate(width / 2, height / 2);
  ctx?.rotate((rotation * Math.PI) / 180);
  ctx?.scale(zoom, zoom); // 🔥 ensures fill after rotation
  ctx?.translate(-width / 2, -height / 2);

  ctx?.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    width,
    height,
  );

  return canvas.toDataURL("image/webp", 0.9);
};

/* -- Sortable Item -- */
const SortableItem = ({ image, index, removeImage, openEditor }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative group"
    >
      {/* Image */}
      <img
        src={image.preview}
        onClick={() => openEditor(index)}
        className="w-full aspect-[3/4] object-cover rounded-lg cursor-pointer"
        alt={`Uploaded ${index + 1}`}
      />

      {/* Drag Handle */}
      <div
        {...listeners}
        className="absolute bottom-1 right-1 bg-black/70 text-white text-sm px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing"
      >
        Drag
      </div>

      {/* Single click remove */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          removeImage(index);
        }}
        className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
      >
        ✕
      </button>

      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
        {index + 1}
      </span>

      {index === 0 && (
        <span className="absolute top-1 left-1 bg-brand-500 text-white text-xs px-2 py-1 rounded">
          Cover
        </span>
      )}
    </div>
  );
};

/* -- Main Component -- */
const DropzoneComponent = () => {
  const [images, setImages] = useState<
    {
      preview: string;
      file: File;
    }[]
  >([]);

  const [uploading, setUploading] = useState(false);

  const {
    setValue,
    register,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    register("productImages", {
      validate: (value) =>
        (value && value.length > 0) || "At least one image is required",
    });
  }, [register]);

  // useEffect(() => {
  //   setValue("productImages", images, {
  //     shouldDirty: true,
  //   });
  // }, [images, setValue]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const [error, setError] = useState("");
  const onDrop = async (files: File[]) => {
    const invalid = files.filter((f) => !f.type.startsWith("image/"));

    if (invalid.length > 0) {
      setError("Only image files are allowed.");
    } else {
      setError("");
    }

    const valid = files.filter((f) => f.type.startsWith("image/"));

    const converted = await Promise.all(
      valid.map(async (file, index) => {
        // convert to webp base64
        const webpBase64 = await convertToWebP(file);

        // convert base64 -> file
        const webpFile = dataURLtoFile(
          webpBase64,
          `product_${Date.now()}_${index}.webp`,
        );

        return {
          preview: webpBase64,
          file: webpFile,
        };
      }),
    );

    setImages((prev) => [...prev, ...converted]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/jpg": [],
    },
  });
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setImages((items) => arrayMove(items, active.id, over.id));
    }
  };

  const uploadImages = async () => {
    try {
      if (images.length === 0) {
        alert("Please select images");

        return;
      }

      setUploading(true);

      // preserve EXACT order
      const orderedFiles = images.map((img) => img.file);

      const imageUrls = await uploadProductImages(orderedFiles);

      setValue("productImages", imageUrls, {
        shouldDirty: true,
      });

      alert("Images uploaded successfully");
    } catch (error) {
      console.error(error);

      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* -- Editor Modal -- */
  const EditorModal = () => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedArea, setCroppedArea] = useState<any>(null);

    const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
      setCroppedArea(croppedAreaPixels);
    }, []);

    const saveEdit = async () => {
      const newImage = await getCroppedImage(
        images[editingIndex!].preview,
        croppedArea,
        rotation,
        zoom,
      );

      const updated = [...images];
      updated[editingIndex!] = {
        preview: newImage,
        file: dataURLtoFile(newImage, `edited_${Date.now()}.webp`),
      };
      setImages(updated);
      setEditingIndex(null);
    };

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-900 w-full max-w-md mx-2 rounded-xl p-3 sm:p-4">
          {/* Crop Area */}
          <div className="relative w-full h-[250px] sm:h-80">
            <Cropper
              image={images[editingIndex!].preview}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={3 / 4}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Rotate Buttons */}
          <div className="flex justify-center gap-4 mt-3">
            <button
              type="button"
              onClick={() => setRotation((prev) => prev - 90)}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded"
            >
              ↺ 90°
            </button>
            <button
              type="button"
              onClick={() => setRotation((prev) => prev + 90)}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded"
            >
              ↻ 90°
            </button>
          </div>

          {/* Controls */}
          <div className="mt-3 space-y-3">
            <div>
              <label className="text-sm dark:text-white">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
                title="Zoom"
              />
            </div>

            <div>
              <label className="text-sm dark:text-white">Rotation</label>
              <input
                type="range"
                min={0}
                max={360}
                step={1}
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full"
                title="Rotation"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              type="button"
              onClick={() => setEditingIndex(null)}
              className="w-full py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveEdit}
              className="w-full py-2 bg-brand-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ComponentCard title="Image Upload">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-dashed border p-8 rounded-xl cursor-pointer transition
        ${
          isDragActive
            ? "border-brand-500 bg-gray-800/40"
            : "border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-center text-gray-800 dark:text-white">
          Drag & Drop Images or Click to Upload
        </p>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
      {errors.productImages && (
        <p className="text-red-500 text-sm mt-2 text-center">
          {errors.productImages.message as string}
        </p>
      )}
      {/* Preview */}
      {images.length > 0 && (
        <div className="mt-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((_, i) => i)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <SortableItem
                    key={index}
                    image={img}
                    index={index}
                    removeImage={removeImage}
                    openEditor={setEditingIndex}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {editingIndex !== null && <EditorModal />}

      {/* Upload Button */}

      {images.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={uploadImages}
            disabled={uploading}
            className="px-5 py-2 bg-brand-500 text-white rounded-lg
      hover:bg-brand-600 transition disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Images"}
          </button>
        </div>
      )}
    </ComponentCard>
  );
};

export default DropzoneComponent;
