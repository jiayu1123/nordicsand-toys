import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, X, Star } from "lucide-react";
import ImageUploader from "./ImageUploader";

export default function GalleryImageEditor({ images = [], onChange }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = [...images];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    onChange(reordered);
  };

  const remove = (i) => onChange(images.filter((_, idx) => idx !== i));

  const setFirst = (i) => {
    if (i === 0) return;
    const reordered = [...images];
    const [item] = reordered.splice(i, 1);
    reordered.unshift(item);
    onChange(reordered);
  };

  const addImages = (uploaded) => {
    const newImgs = Array.isArray(uploaded) ? uploaded : [uploaded];
    onChange([...images, ...newImgs.filter(Boolean)]);
  };

  return (
    <div className="space-y-3">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="gallery">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {images.map((url, i) => (
                <Draggable key={url + i} draggableId={`img-${i}`} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2 border transition-all ${
                        snapshot.isDragging
                          ? "border-sky-300 shadow-lg bg-white"
                          : "border-transparent"
                      }`}
                    >
                      {/* Drag handle */}
                      <div
                        {...provided.dragHandleProps}
                        className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing shrink-0"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>

                      {/* Thumbnail */}
                      <img
                        src={url}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-100"
                      />

                      {/* Index badge */}
                      <span className="text-xs text-slate-400 font-mono shrink-0">
                        #{i + 1}
                      </span>
                      {i === 0 && (
                        <span className="text-xs bg-sky-100 text-sky-600 font-semibold px-2 py-0.5 rounded-full shrink-0">
                          Primary
                        </span>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-400 truncate">{url.split("/").pop()}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {i !== 0 && (
                          <button
                            type="button"
                            onClick={() => setFirst(i)}
                            title="Set as Primary"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-500 hover:bg-sky-50 transition-colors"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => remove(i)}
                          title="Remove image"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add more images */}
      <ImageUploader
        value={[]}
        onChange={addImages}
        multiple
        label="Add gallery images"
      />

      {images.length > 0 && (
        <p className="text-xs text-slate-400">
          Drag rows to reorder · ★ to set as primary · first image shows first in gallery
        </p>
      )}
    </div>
  );
}