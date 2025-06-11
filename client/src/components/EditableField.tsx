import { useState, useRef, useEffect } from "react";

type EditableFieldProps = {
  className?: string;
  value: string;
  fieldName: string; // Название поля для отправки на бэкенд
  filmId: number; // ID фильма для обновления
  onUpdate: (fieldName: string, value: string, filmId: number) => Promise<void>;
};

export default function EditableField({
  className,
  value,
  fieldName,
  filmId,
  onUpdate,
}: EditableFieldProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  const handleEditClick = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
    setFieldValue(value)
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdate(fieldName, fieldValue, filmId);
      setIsEdit(false);
    } catch (error) {
      console.error("Update failed:", error);
      setFieldValue(value);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isEdit ? (
        <input
          ref={inputRef}
          onChange={(e) => setFieldValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-black text-white px-2 py-1 rounded"
          value={fieldValue}
          disabled={isLoading}
        />
      ) : (
        <p className={className}>{fieldValue}</p>
      )}

      {isEdit ? (
        <div className="flex gap-1">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="text-green-500 hover:text-green-700 disabled:opacity-50"
          >
            {isLoading ? (
              "Saving..."
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </div>
      ) : (
        <button
          onClick={handleEditClick}
          className="text-blue-500 hover:text-blue-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </button>
      )}
    </div>
  );
}