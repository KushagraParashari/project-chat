import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

/**
 * Custom hook for handling errors
 */
const useErrors = (errors = []) => {
  useEffect(() => {
    if (!Array.isArray(errors)) return;

    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else toast.error(error?.data?.message || "Something went wrong");
      }
    });
  }, [errors]);
};

const useAsyncMutation = (mutation) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const executeMutation = async (toastMessage, payload) => {
    setIsLoading(true);
    const toastId = toast.loading(toastMessage || "Updating data...");

    try {
      // ✅ unwrap() gives clean response instead of action object
      const response = await mutation(payload).unwrap();

      setData(response || null);
      setError(null);

      toast.success(response?.message || "Update successful", { id: toastId });
      return response;
    } catch (err) {
      setError(err);
      toast.error(err?.data?.message || err?.message || "Something went wrong", {
        id: toastId,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return [executeMutation, isLoading, data, error];
};

/**
 * Custom hook for handling socket events safely
 */
const useSocketEvents = (socket, handlers = {}) => {
  useEffect(() => {
    // ✅ Guard: make sure socket exists and has .on
    if (!socket || typeof socket.on !== "function") return;

    const eventEntries = Object.entries(handlers);

    eventEntries.forEach(([event, handler]) => {
      if (typeof handler === "function") {
        socket.on(event, handler);
      }
    });

    return () => {
      eventEntries.forEach(([event, handler]) => {
        if (typeof handler === "function") {
          socket.off(event, handler);
        }
      });
    };
  }, [socket, JSON.stringify(Object.keys(handlers))]);
};

export { useErrors, useAsyncMutation, useSocketEvents };
